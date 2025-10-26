export class MatchController {
  constructor(supabase, io, judgeService, eloRatingService) {
    this.supabase = supabase;
    this.io = io;
    this.judgeService = judgeService;
    this.eloRatingService = eloRatingService;
    this.activeMatches = new Map();
  }

  async startMatch(matchId, playerA, playerB, problem) {
    console.log(`Starting match ${matchId}`);

    const matchData = {
      matchId,
      playerA,
      playerB,
      problem,
      startTime: Date.now(),
      timeLimit: problem.time_limit_seconds * 1000,
      submissions: new Map(),
      winner: null,
      status: 'in_progress'
    };

    this.activeMatches.set(matchId, matchData);

    await this.supabase
      .from('matches')
      .update({
        status: 'in_progress',
        start_time: new Date().toISOString()
      })
      .eq('id', matchId);

    const playerASocket = this.io.sockets.sockets.get(playerA.socketId);
    const playerBSocket = this.io.sockets.sockets.get(playerB.socketId);

    if (playerASocket) {
      playerASocket.emit('duel_started', {
        matchId,
        startTime: matchData.startTime,
        timeLimit: problem.time_limit_seconds,
        problem: {
          id: problem.id,
          title: problem.title,
          statement: problem.statement,
          difficulty: problem.difficulty,
          supportedLanguages: problem.supported_languages
        }
      });
    }

    if (playerBSocket) {
      playerBSocket.emit('duel_started', {
        matchId,
        startTime: matchData.startTime,
        timeLimit: problem.time_limit_seconds,
        problem: {
          id: problem.id,
          title: problem.title,
          statement: problem.statement,
          difficulty: problem.difficulty,
          supportedLanguages: problem.supported_languages
        }
      });
    }

    setTimeout(() => {
      this.endMatchByTimeout(matchId);
    }, matchData.timeLimit);
  }

  async handleSubmission(matchId, userId, language, code, socket) {
    const match = this.activeMatches.get(matchId);

    if (!match) {
      throw new Error('Match not found or already ended');
    }

    if (match.winner) {
      throw new Error('Match already has a winner');
    }

    console.log(`Processing submission for match ${matchId} from user ${userId}`);

    socket.emit('submission_received', {
      message: 'Running tests...'
    });

    const { data: problemData } = await this.supabase
      .from('problems')
      .select('test_cases')
      .eq('id', match.problem.id)
      .single();

    const testCases = problemData.test_cases || [];

    const judgeResults = await this.judgeService.executeCode(code, language, testCases);

    const submissionTime = Date.now();
    const elapsedTime = Math.floor((submissionTime - match.startTime) / 1000);

    const { data: submission, error: submissionError } = await this.supabase
      .from('submissions')
      .insert({
        match_id: matchId,
        user_id: userId,
        language,
        code,
        result: judgeResults.result,
        score: judgeResults.score,
        passed_tests: judgeResults.passed,
        total_tests: judgeResults.total,
        runtime_ms: judgeResults.runtimeMs,
        memory_kb: judgeResults.memoryKb,
        test_results: judgeResults.testResults,
        is_winning_submission: false
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving submission:', submissionError);
    }

    match.submissions.set(userId, {
      ...judgeResults,
      submittedAt: submissionTime,
      elapsedTime,
      submissionId: submission?.id
    });

    const playerASocket = this.io.sockets.sockets.get(match.playerA.socketId);
    const playerBSocket = this.io.sockets.sockets.get(match.playerB.socketId);

    const isPlayerA = userId === match.playerA.userId;
    const targetSocket = isPlayerA ? playerASocket : playerBSocket;
    const opponentSocket = isPlayerA ? playerBSocket : playerASocket;

    if (targetSocket) {
      targetSocket.emit('submission_result', {
        submissionId: submission?.id,
        result: judgeResults.result,
        score: judgeResults.score,
        passed: judgeResults.passed,
        total: judgeResults.total,
        testResults: judgeResults.testResults,
        runtimeMs: judgeResults.runtimeMs
      });
    }

    if (opponentSocket) {
      opponentSocket.emit('opponent_submitted', {
        result: judgeResults.result,
        score: judgeResults.score,
        passed: judgeResults.passed,
        total: judgeResults.total
      });
    }

    if (judgeResults.result === 'accepted') {
      await this.endMatch(matchId, userId, 'correct_solution');
    } else {
      const playerASubmission = match.submissions.get(match.playerA.userId);
      const playerBSubmission = match.submissions.get(match.playerB.userId);

      if (playerASubmission && playerBSubmission) {
        if (playerASubmission.result !== 'accepted' && playerBSubmission.result !== 'accepted') {
          console.log('Both players submitted but neither passed all tests');
        }
      }
    }
  }

  async endMatchByTimeout(matchId) {
    const match = this.activeMatches.get(matchId);

    if (!match || match.winner) {
      return;
    }

    console.log(`Match ${matchId} ended by timeout`);

    const playerASubmission = match.submissions.get(match.playerA.userId);
    const playerBSubmission = match.submissions.get(match.playerB.userId);

    let winnerId = null;
    let reason = 'timeout';

    if (playerASubmission && playerBSubmission) {
      if (playerASubmission.score > playerBSubmission.score) {
        winnerId = match.playerA.userId;
        reason = 'higher_score';
      } else if (playerBSubmission.score > playerASubmission.score) {
        winnerId = match.playerB.userId;
        reason = 'higher_score';
      } else {
        reason = 'draw';
      }
    } else if (playerASubmission) {
      winnerId = match.playerA.userId;
      reason = 'opponent_no_submission';
    } else if (playerBSubmission) {
      winnerId = match.playerB.userId;
      reason = 'opponent_no_submission';
    } else {
      reason = 'draw_no_submissions';
    }

    await this.endMatch(matchId, winnerId, reason);
  }

  async endMatch(matchId, winnerId, reason) {
    const match = this.activeMatches.get(matchId);

    if (!match || match.winner) {
      return;
    }

    match.winner = winnerId;
    match.status = 'completed';

    const endTime = Date.now();
    const durationSeconds = Math.floor((endTime - match.startTime) / 1000);

    const { data: playerAData } = await this.supabase
      .from('duel_users')
      .select('*')
      .eq('id', match.playerA.userId)
      .single();

    const { data: playerBData } = await this.supabase
      .from('duel_users')
      .select('*')
      .eq('id', match.playerB.userId)
      .single();

    const ratingChanges = this.eloRatingService.calculateRatingChange(
      playerAData.rating,
      playerBData.rating,
      winnerId === match.playerA.userId ? 1 : (winnerId === match.playerB.userId ? 0 : 0.5),
      playerAData.matches_played
    );

    const newRatingA = playerAData.rating + ratingChanges.playerAChange;
    const newRatingB = playerBData.rating + ratingChanges.playerBChange;

    await this.supabase
      .from('matches')
      .update({
        status: 'completed',
        winner_id: winnerId,
        end_time: new Date().toISOString(),
        duration_seconds: durationSeconds,
        player_a_rating_after: newRatingA,
        player_b_rating_after: newRatingB
      })
      .eq('id', matchId);

    const updatePlayerA = this.supabase
      .from('duel_users')
      .update({
        rating: newRatingA,
        wins: winnerId === match.playerA.userId ? playerAData.wins + 1 : playerAData.wins,
        losses: winnerId === match.playerB.userId ? playerAData.losses + 1 : playerAData.losses,
        draws: !winnerId ? playerAData.draws + 1 : playerAData.draws,
        matches_played: playerAData.matches_played + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', match.playerA.userId);

    const updatePlayerB = this.supabase
      .from('duel_users')
      .update({
        rating: newRatingB,
        wins: winnerId === match.playerB.userId ? playerBData.wins + 1 : playerBData.wins,
        losses: winnerId === match.playerA.userId ? playerBData.losses + 1 : playerBData.losses,
        draws: !winnerId ? playerBData.draws + 1 : playerBData.draws,
        matches_played: playerBData.matches_played + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', match.playerB.userId);

    await Promise.all([updatePlayerA, updatePlayerB]);

    if (winnerId) {
      await this.supabase
        .from('submissions')
        .update({ is_winning_submission: true })
        .eq('match_id', matchId)
        .eq('user_id', winnerId)
        .order('submitted_at', { ascending: false })
        .limit(1);
    }

    await this.createReplay(matchId, match);

    const playerASocket = this.io.sockets.sockets.get(match.playerA.socketId);
    const playerBSocket = this.io.sockets.sockets.get(match.playerB.socketId);

    const matchEndData = {
      matchId,
      winnerId,
      reason,
      duration: durationSeconds,
      playerA: {
        userId: match.playerA.userId,
        ratingBefore: playerAData.rating,
        ratingAfter: newRatingA,
        ratingChange: ratingChanges.playerAChange,
        submission: match.submissions.get(match.playerA.userId)
      },
      playerB: {
        userId: match.playerB.userId,
        ratingBefore: playerBData.rating,
        ratingAfter: newRatingB,
        ratingChange: ratingChanges.playerBChange,
        submission: match.submissions.get(match.playerB.userId)
      }
    };

    if (playerASocket) {
      playerASocket.emit('match_end', matchEndData);
    }

    if (playerBSocket) {
      playerBSocket.emit('match_end', matchEndData);
    }

    this.activeMatches.delete(matchId);
    console.log(`Match ${matchId} ended. Winner: ${winnerId || 'Draw'}`);
  }

  async createReplay(matchId, match) {
    try {
      const { data: snapshots } = await this.supabase
        .from('code_snapshots')
        .select('*')
        .eq('match_id', matchId)
        .order('timestamp', { ascending: true });

      const playerATimeline = snapshots
        ?.filter(s => s.user_id === match.playerA.userId)
        .map(s => ({ timestamp: s.timestamp, code: s.code })) || [];

      const playerBTimeline = snapshots
        ?.filter(s => s.user_id === match.playerB.userId)
        .map(s => ({ timestamp: s.timestamp, code: s.code })) || [];

      const events = [];

      const playerASubmission = match.submissions.get(match.playerA.userId);
      const playerBSubmission = match.submissions.get(match.playerB.userId);

      if (playerASubmission) {
        events.push({
          type: 'submission',
          userId: match.playerA.userId,
          timestamp: playerASubmission.submittedAt,
          result: playerASubmission.result,
          score: playerASubmission.score
        });
      }

      if (playerBSubmission) {
        events.push({
          type: 'submission',
          userId: match.playerB.userId,
          timestamp: playerBSubmission.submittedAt,
          result: playerBSubmission.result,
          score: playerBSubmission.score
        });
      }

      await this.supabase
        .from('match_replays')
        .insert({
          match_id: matchId,
          player_a_timeline: playerATimeline,
          player_b_timeline: playerBTimeline,
          events
        });

      console.log(`Replay created for match ${matchId}`);
    } catch (error) {
      console.error('Error creating replay:', error);
    }
  }
}
