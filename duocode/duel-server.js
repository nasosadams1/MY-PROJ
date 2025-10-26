import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MatchmakingService } from './services/matchmaking.js';
import { JudgeService } from './services/judge.js';
import { MatchController } from './services/match-controller.js';
import { EloRatingService } from './services/elo-rating.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

const matchmakingService = new MatchmakingService(supabase);
const judgeService = new JudgeService();
const eloRatingService = new EloRatingService();
const matchController = new MatchController(supabase, io, judgeService, eloRatingService);

const connectedPlayers = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('register_player', async (data) => {
    const { userId, username, rating } = data;
    connectedPlayers.set(socket.id, { userId, username, rating, socketId: socket.id });
    socket.userId = userId;
    console.log(`Player registered: ${username} (${userId})`);
  });

  socket.on('join_matchmaking', async (data) => {
    const { userId, rating, matchType = 'ranked' } = data;
    const player = connectedPlayers.get(socket.id);

    if (!player) {
      socket.emit('error', { message: 'Player not registered' });
      return;
    }

    console.log(`Player ${player.username} joining matchmaking queue...`);
    socket.emit('queue_joined', { message: 'Searching for opponent...' });

    try {
      const match = await matchmakingService.addToQueue({
        userId: player.userId,
        username: player.username,
        rating: player.rating || rating,
        socketId: socket.id,
        matchType
      });

      if (match) {
        const { playerA, playerB, problem, matchId } = match;

        const playerASocket = io.sockets.sockets.get(playerA.socketId);
        const playerBSocket = io.sockets.sockets.get(playerB.socketId);

        if (playerASocket && playerBSocket) {
          playerASocket.emit('match_found', {
            matchId,
            opponent: { username: playerB.username, rating: playerB.rating },
            problem: {
              id: problem.id,
              title: problem.title,
              statement: problem.statement,
              difficulty: problem.difficulty,
              timeLimit: problem.time_limit_seconds,
              supportedLanguages: problem.supported_languages
            },
            countdown: 3
          });

          playerBSocket.emit('match_found', {
            matchId,
            opponent: { username: playerA.username, rating: playerA.rating },
            problem: {
              id: problem.id,
              title: problem.title,
              statement: problem.statement,
              difficulty: problem.difficulty,
              timeLimit: problem.time_limit_seconds,
              supportedLanguages: problem.supported_languages
            },
            countdown: 3
          });

          setTimeout(() => {
            matchController.startMatch(matchId, playerA, playerB, problem);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Matchmaking error:', error);
      socket.emit('error', { message: 'Failed to join matchmaking' });
    }
  });

  socket.on('leave_matchmaking', () => {
    const player = connectedPlayers.get(socket.id);
    if (player) {
      matchmakingService.removeFromQueue(player.userId);
      socket.emit('queue_left', { message: 'Left matchmaking queue' });
    }
  });

  socket.on('submit_code', async (data) => {
    const { matchId, userId, language, code } = data;
    console.log(`Code submission from user ${userId} in match ${matchId}`);

    try {
      await matchController.handleSubmission(matchId, userId, language, code, socket);
    } catch (error) {
      console.error('Submission error:', error);
      socket.emit('submission_error', { message: error.message });
    }
  });

  socket.on('code_snapshot', async (data) => {
    const { matchId, userId, code } = data;

    try {
      await supabase
        .from('code_snapshots')
        .insert({
          match_id: matchId,
          user_id: userId,
          code,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Snapshot error:', error);
    }
  });

  socket.on('disconnect', () => {
    const player = connectedPlayers.get(socket.id);
    if (player) {
      matchmakingService.removeFromQueue(player.userId);
      connectedPlayers.delete(socket.id);
      console.log(`Player disconnected: ${player.username}`);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        duel_users (username, avatar_url)
      `)
      .order('rating', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/match/:matchId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player_a:duel_users!matches_player_a_id_fkey(username, avatar_url),
        player_b:duel_users!matches_player_b_id_fkey(username, avatar_url),
        problem:problems(*),
        submissions(*)
      `)
      .eq('id', req.params.matchId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:userId/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('duel_users')
      .select('*')
      .eq('id', req.params.userId)
      .single();

    if (error) throw error;

    const { data: recentMatches } = await supabase
      .from('matches')
      .select(`
        *,
        problem:problems(title, difficulty)
      `)
      .or(`player_a_id.eq.${req.params.userId},player_b_id.eq.${req.params.userId}`)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({ user: data, recentMatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.DUEL_SERVER_PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Duel server running on port ${PORT}`);
});
