import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(bodyParser.json());



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, './leaderboard.db');
const db = new sqlite3.Database(dbFile);

// Initialize database with correct schema
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      avatar TEXT DEFAULT '👤',
      badge TEXT DEFAULT 'Beginner',
      external_id TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Stats table with consistent column names
  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      user_id INTEGER UNIQUE,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      lessons INTEGER DEFAULT 0,
      projects INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      achievements INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Score events for tracking changes over time
  db.run(`
    CREATE TABLE IF NOT EXISTS score_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      xp_delta INTEGER DEFAULT 0,
      lessons_delta INTEGER DEFAULT 0,
      achievements_delta INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Migration: Rename completedLessons to lessons if it exists
  db.all("PRAGMA table_info(stats)", (err, columns) => {
    if (err) {
      console.error('Error checking table info:', err);
      return;
    }
    
    const hasCompletedLessons = columns.some(col => col.name === 'completedLessons');
    const hasLessons = columns.some(col => col.name === 'lessons');
    
    if (hasCompletedLessons && !hasLessons) {
      console.log('Migrating completedLessons to lessons...');
      db.run(`ALTER TABLE stats ADD COLUMN lessons INTEGER DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding lessons column:', err);
          return;
        }
        db.run(`UPDATE stats SET lessons = completedLessons WHERE completedLessons IS NOT NULL`);
      });
    }
    
    // Add missing columns if they don't exist
    const addColumnIfNotExists = (column, type, defaultValue = null) => {
      const exists = columns.some(col => col.name === column);
      if (!exists) {
        const defaultClause = defaultValue ? ` DEFAULT ${defaultValue}` : '';
        db.run(`ALTER TABLE stats ADD COLUMN ${column} ${type}${defaultClause}`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error(`Error adding ${column} column:`, err);
          }
        });
      }
    };

    addColumnIfNotExists('lessons', 'INTEGER', '0');
    addColumnIfNotExists('achievements', 'INTEGER', '0');
  });

  // Check and add missing columns to score_events
  db.all("PRAGMA table_info(score_events)", (err, columns) => {
    if (err) return;
    
    const addColumnIfNotExists = (column, type, defaultValue = null) => {
      const exists = columns.some(col => col.name === column);
      if (!exists) {
        const defaultClause = defaultValue ? ` DEFAULT ${defaultValue}` : '';
        db.run(`ALTER TABLE score_events ADD COLUMN ${column} ${type}${defaultClause}`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error(`Error adding ${column} column to score_events:`, err);
          }
        });
      }
    };

    addColumnIfNotExists('lessons_delta', 'INTEGER', '0');
    addColumnIfNotExists('achievements_delta', 'INTEGER', '0');
  });
});

// Helper functions
const safeParseInt = (value, defaultValue = 0) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getDateWindow = (frame) => {
  const now = new Date();
  if (frame === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return weekAgo.toISOString();
  }
  if (frame === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return monthAgo.toISOString();
  }
  return null;
};

// Get total player count
const getTotalPlayerCount = (frame = 'all', callback) => {
  let sql = `
    SELECT COUNT(DISTINCT u.id) as total 
    FROM users u 
    LEFT JOIN stats s ON s.user_id = u.id 
    WHERE COALESCE(s.xp, 0) >= 0
  `;
  
  db.get(sql, [], (err, result) => {
    callback(err, result?.total || 0);
  });
};

// FIXED: Get user rank by category - no template literals in SQL
const getUserRank = (userId, category = 'xp', frame = 'all', callback) => {
  if (!userId) return callback(null, 0);

  const dateWindow = getDateWindow(frame);
  let sql, params;

  if (frame === 'all') {
    // All-time ranking based on total stats
    let orderField = 'xp';
    if (category === 'lessons') orderField = 'lessons';
    else if (category === 'achievements') orderField = 'achievements';

    // FIXED: Build SQL without template literals
    sql = `
      SELECT COUNT(*) + 1 as rank
      FROM users u
      LEFT JOIN stats s ON s.user_id = u.id
      WHERE COALESCE(s.` + orderField + `, 0) > (
        SELECT COALESCE(s2.` + orderField + `, 0)
        FROM users u2
        LEFT JOIN stats s2 ON s2.user_id = u2.id
        WHERE u2.external_id = ? OR u2.id = ?
      )
    `;
    params = [userId, userId];
  } else {
    // Time-based ranking - no template literals
    let deltaField = 'xp_delta';
    let totalField = 'xp';
    if (category === 'lessons') {
      deltaField = 'lessons_delta';
      totalField = 'lessons';
    } else if (category === 'achievements') {
      deltaField = 'achievements_delta';
      totalField = 'achievements';
    }

    sql = `
      WITH recent_stats AS (
        SELECT 
          u.id as user_id,
          COALESCE(SUM(se.` + deltaField + `), 0) as recent_delta,
          COALESCE(s.` + totalField + `, 0) as total_value,
          CASE 
            WHEN SUM(se.` + deltaField + `) > 0 THEN SUM(se.` + deltaField + `)
            WHEN s.updated_at >= ? AND s.` + totalField + ` > 0 THEN s.` + totalField + `
            ELSE 0
          END as recent_value
        FROM users u
        LEFT JOIN stats s ON s.user_id = u.id
        LEFT JOIN score_events se ON se.user_id = u.id AND se.created_at >= ?
        GROUP BY u.id, s.` + totalField + `, s.updated_at
      ),
      user_recent AS (
        SELECT COALESCE(rs.recent_value, 0) as user_value
        FROM users u
        LEFT JOIN recent_stats rs ON rs.user_id = u.id
        WHERE u.external_id = ? OR u.id = ?
      )
      SELECT COUNT(*) + 1 as rank
      FROM recent_stats rs
      WHERE rs.recent_value > (SELECT user_value FROM user_recent)
    `;
    params = [dateWindow, dateWindow, userId, userId];
  }

  db.get(sql, params, (err, result) => {
    if (err) {
      console.error('getUserRank error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
    }
    callback(err, result?.rank || 0);
  });
};

// FIXED: Get user stats - no template literals in SQL
const getUserStats = (userId, frame = 'all', callback) => {
  if (!userId) return callback(null, null);

  const dateWindow = getDateWindow(frame);
  let sql, params;

  if (frame === 'all') {
    // All-time stats
    sql = `
      SELECT 
        u.id,
        u.name,
        u.avatar,
        u.badge,
        COALESCE(u.external_id, u.id) as external_id,
        COALESCE(s.xp, 0) as xp,
        COALESCE(s.level, 1) as level,
        COALESCE(s.lessons, 0) as lessons,
        COALESCE(s.projects, 0) as projects,
        COALESCE(s.streak, 0) as streak,
        COALESCE(s.achievements, 0) as achievements
      FROM users u
      LEFT JOIN stats s ON s.user_id = u.id
      WHERE u.external_id = ? OR u.id = ?
    `;
    params = [userId, userId];
  } else {
    // Time-based stats - no template literals
    sql = `
      WITH recent_stats AS (
        SELECT 
          u.id,
          u.name,
          u.avatar,
          u.badge,
          COALESCE(u.external_id, u.id) as external_id,
          COALESCE(s.level, 1) as level,
          COALESCE(s.projects, 0) as projects,
          COALESCE(s.streak, 0) as streak,
          CASE 
            WHEN SUM(se.xp_delta) > 0 THEN SUM(se.xp_delta)
            WHEN s.updated_at >= ? AND s.xp > 0 THEN s.xp
            ELSE 0
          END as xp,
          CASE 
            WHEN SUM(se.lessons_delta) > 0 THEN SUM(se.lessons_delta)
            WHEN s.updated_at >= ? AND s.lessons > 0 THEN s.lessons
            ELSE 0
          END as lessons,
          CASE 
            WHEN SUM(se.achievements_delta) > 0 THEN SUM(se.achievements_delta)
            WHEN s.updated_at >= ? AND s.achievements > 0 THEN s.achievements
            ELSE 0
          END as achievements
        FROM users u
        LEFT JOIN stats s ON s.user_id = u.id
        LEFT JOIN score_events se ON se.user_id = u.id AND se.created_at >= ?
        WHERE u.external_id = ? OR u.id = ?
        GROUP BY u.id, u.name, u.avatar, u.badge, u.external_id, s.level, s.projects, s.streak, s.updated_at, s.xp, s.lessons, s.achievements
      )
      SELECT * FROM recent_stats
    `;
    params = [dateWindow, dateWindow, dateWindow, dateWindow, userId, userId];
  }

  db.get(sql, params, (err, result) => {
    if (err) {
      console.error('getUserStats error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
      return callback(err, null);
    }
    
    if (!result) return callback(null, null);

    // Ensure all numeric fields are properly converted
    const safeResult = {
      ...result,
      xp: safeParseInt(result.xp, 0),
      level: safeParseInt(result.level, 1),
      lessons: safeParseInt(result.lessons, 0),
      projects: safeParseInt(result.projects, 0),
      streak: safeParseInt(result.streak, 0),
      achievements: safeParseInt(result.achievements, 0)
    };

    callback(null, safeResult);
  });
};

// FIXED: Get paginated leaderboard - no template literals in SQL
const getPaginatedLeaderboard = (frame = 'all', page = 1, limit = 100, sortBy = 'xp', callback) => {
  const offset = (page - 1) * limit;
  const dateWindow = getDateWindow(frame);
  
  let sql, params;

  if (frame === 'all') {
    // All-time leaderboard
    let orderField = 'xp';
    if (sortBy === 'lessons') orderField = 'lessons';
    else if (sortBy === 'achievements') orderField = 'achievements';

    // FIXED: Build SQL without template literals
    sql = `
      WITH ranked_users AS (
        SELECT 
          u.id,
          u.name,
          u.avatar,
          u.badge,
          COALESCE(u.external_id, u.id) as external_id,
          COALESCE(s.xp, 0) as xp,
          COALESCE(s.level, 1) as level,
          COALESCE(s.lessons, 0) as lessons,
          COALESCE(s.projects, 0) as projects,
          COALESCE(s.streak, 0) as streak,
          COALESCE(s.achievements, 0) as achievements,
          ROW_NUMBER() OVER (ORDER BY COALESCE(s.xp, 0) DESC) as globalRank,
          ROW_NUMBER() OVER (ORDER BY COALESCE(s.lessons, 0) DESC) as lessonsRank,
          ROW_NUMBER() OVER (ORDER BY COALESCE(s.achievements, 0) DESC) as achievementsRank
        FROM users u
        LEFT JOIN stats s ON s.user_id = u.id
        ORDER BY COALESCE(s.` + orderField + `, 0) DESC
      )
      SELECT * FROM ranked_users
      LIMIT ? OFFSET ?
    `;
    params = [limit, offset];
  } else {
    // Time-based leaderboard - no template literals
    let orderField = 'recent_xp';
    if (sortBy === 'lessons') orderField = 'recent_lessons';
    else if (sortBy === 'achievements') orderField = 'recent_achievements';

    sql = `
      WITH recent_stats AS (
        SELECT 
          u.id,
          u.name,
          u.avatar,
          u.badge,
          COALESCE(u.external_id, u.id) as external_id,
          COALESCE(s.level, 1) as level,
          COALESCE(s.projects, 0) as projects,
          COALESCE(s.streak, 0) as streak,
          CASE 
            WHEN SUM(se.xp_delta) > 0 THEN SUM(se.xp_delta)
            WHEN s.updated_at >= ? AND s.xp > 0 THEN s.xp
            ELSE 0
          END as recent_xp,
          CASE 
            WHEN SUM(se.lessons_delta) > 0 THEN SUM(se.lessons_delta)
            WHEN s.updated_at >= ? AND s.lessons > 0 THEN s.lessons
            ELSE 0
          END as recent_lessons,
          CASE 
            WHEN SUM(se.achievements_delta) > 0 THEN SUM(se.achievements_delta)
            WHEN s.updated_at >= ? AND s.achievements > 0 THEN s.achievements
            ELSE 0
          END as recent_achievements
        FROM users u
        LEFT JOIN stats s ON s.user_id = u.id
        LEFT JOIN score_events se ON se.user_id = u.id AND se.created_at >= ?
        GROUP BY u.id, u.name, u.avatar, u.badge, u.external_id, s.level, s.projects, s.streak, s.updated_at, s.xp, s.lessons, s.achievements
        HAVING recent_xp > 0 OR recent_lessons > 0 OR recent_achievements > 0
      ),
      ranked_users AS (
        SELECT 
          *,
          recent_xp as xp,
          recent_lessons as lessons,
          recent_achievements as achievements,
          ROW_NUMBER() OVER (ORDER BY recent_xp DESC) as globalRank,
          ROW_NUMBER() OVER (ORDER BY recent_lessons DESC) as lessonsRank,
          ROW_NUMBER() OVER (ORDER BY recent_achievements DESC) as achievementsRank
        FROM recent_stats
        ORDER BY ` + orderField + ` DESC
      )
      SELECT * FROM ranked_users
      LIMIT ? OFFSET ?
    `;
    params = [dateWindow, dateWindow, dateWindow, dateWindow, limit, offset];
  }

  db.all(sql, params, (err, results) => {
    if (err) {
      console.error('getPaginatedLeaderboard error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
      return callback(err, []);
    }

    const safeResults = (results || []).map((player, index) => ({
      ...player,
      id: player.external_id || player.id || 'unknown',
      name: player.name || 'Unknown Player',
      xp: safeParseInt(player.xp, 0),
      level: safeParseInt(player.level, 1),
      lessons: safeParseInt(player.lessons, 0),
      projects: safeParseInt(player.projects, 0),
      streak: safeParseInt(player.streak, 0),
      achievements: safeParseInt(player.achievements, 0),
      globalRank: safeParseInt(player.globalRank, (page - 1) * limit + index + 1),
      lessonsRank: safeParseInt(player.lessonsRank, (page - 1) * limit + index + 1),
      achievementsRank: safeParseInt(player.achievementsRank, (page - 1) * limit + index + 1)
    }));

    callback(null, safeResults);
  });
};

// Update user stats
const updateUserStats = (userId, stats, callback) => {
  const {
    xp = 0,
    level = 1,
    lessons = 0,
    projects = 0,
    streak = 0,
    achievements = 0,
    xpDelta = 0,
    lessonsDelta = 0,
    achievementsDelta = 0
  } = stats || {};

  db.serialize(() => {
    // Update or insert stats
    db.run(`
      INSERT INTO stats (user_id, xp, level, lessons, projects, streak, achievements, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        xp = excluded.xp,
        level = excluded.level,
        lessons = excluded.lessons,
        projects = excluded.projects,
        streak = excluded.streak,
        achievements = excluded.achievements,
        updated_at = CURRENT_TIMESTAMP
    `, [userId, xp, level, lessons, projects, streak, achievements], (err) => {
      if (err) return callback(err);

      // ALWAYS create score event for time-based tracking
      db.run(`
        INSERT INTO score_events (user_id, xp_delta, lessons_delta, achievements_delta, created_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, xpDelta, lessonsDelta, achievementsDelta], (eventErr) => {
        if (eventErr) console.error('Error creating score event:', eventErr);
        callback(null, userId);
      });
    });
  });
};

// Upsert user and stats
const upsertUserAndStats = (payload, callback) => {
  const {
    name,
    userId: externalId,
    avatar = '👤',
    badge = 'Beginner',
    xp = 0,
    level = 1,
    lessons = 0,
    completedLessons = 0,
    projects = 0,
    streak = 0,
    achievements = 0,
    xpDelta = 0
  } = payload || {};

  if (!name) return callback(new Error('Name is required'));

  const finalLessons = lessons || completedLessons || 0;

  db.serialize(() => {
    db.get(`
      SELECT id FROM users 
      WHERE name = ? OR external_id = ?
    `, [name, externalId], (err, existingUser) => {
      if (err) return callback(err);

      const handleUserUpdate = (userId) => {
        db.get(`
          SELECT * FROM stats WHERE user_id = ?
        `, [userId], (statsErr, prevStats) => {
          if (statsErr) return callback(statsErr);

          const lessonsDelta = finalLessons - (prevStats?.lessons || 0);
          const achievementsDelta = achievements - (prevStats?.achievements || 0);
          const calculatedXpDelta = xpDelta || (xp - (prevStats?.xp || 0));

          updateUserStats(userId, {
            xp,
            level,
            lessons: finalLessons,
            projects,
            streak,
            achievements,
            xpDelta: calculatedXpDelta,
            lessonsDelta: Math.max(0, lessonsDelta),
            achievementsDelta: Math.max(0, achievementsDelta)
          }, callback);
        });
      };

      if (existingUser) {
        db.run(`
          UPDATE users 
          SET avatar = ?, badge = ?, external_id = ?
          WHERE id = ?
        `, [avatar, badge, externalId, existingUser.id], (updateErr) => {
          if (updateErr) return callback(updateErr);
          handleUserUpdate(existingUser.id);
        });
      } else {
        db.run(`
          INSERT INTO users (name, avatar, badge, external_id)
          VALUES (?, ?, ?, ?)
        `, [name, avatar, badge, externalId], function(insertErr) {
          if (insertErr) return callback(insertErr);
          handleUserUpdate(this.lastID);
        });
      }
    });
  });
};

// Add a debug endpoint to check your data
app.get('/debug/:userId', (req, res) => {
  const userId = req.params.userId;
  
  Promise.all([
    new Promise(resolve => {
      db.get('SELECT * FROM users WHERE external_id = ? OR id = ?', [userId, userId], (err, user) => {
        resolve({ user, error: err });
      });
    }),
    new Promise(resolve => {
      db.get('SELECT * FROM stats WHERE user_id = (SELECT id FROM users WHERE external_id = ? OR id = ?)', [userId, userId], (err, stats) => {
        resolve({ stats, error: err });
      });
    }),
    new Promise(resolve => {
      db.all('SELECT * FROM score_events WHERE user_id = (SELECT id FROM users WHERE external_id = ? OR id = ?) ORDER BY created_at DESC LIMIT 10', [userId, userId], (err, events) => {
        resolve({ events, error: err });
      });
    })
  ]).then(([userResult, statsResult, eventsResult]) => {
    res.json({
      user: userResult.user,
      stats: statsResult.stats,
      recentEvents: eventsResult.events,
      errors: {
        user: userResult.error,
        stats: statsResult.error,
        events: eventsResult.error
      }
    });
  });
});

// Emit leaderboards to all connected clients
const emitLeaderboards = () => {
  const frames = ['all', 'month', 'week'];
  const frameLabels = ['All Time', 'This Month', 'This Week'];

  frames.forEach((frame, index) => {
    getPaginatedLeaderboard(frame, 1, 100, 'xp', (err, data) => {
      if (!err && data) {
        io.emit('leaderboard:update', {
          frame: frameLabels[index],
          data: data
        });
      } else if (err) {
        console.error(`Error emitting \${frameLabels[index]} leaderboard:`, err);
      }
    });
  });
};

// REST API Endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Leaderboard API is running',
    endpoints: {
      '/leaderboard': 'GET - Get basic leaderboard',
      '/leaderboard/paginated': 'POST - Get paginated leaderboard with rankings',
      '/submit': 'POST - Submit user stats',
      '/debug/:userId': 'GET - Debug user data'
    }
  });
});

app.get('/leaderboard', (req, res) => {
  const frame = (req.query.frame || 'all').toString().toLowerCase();
  getPaginatedLeaderboard(frame, 1, 100, 'xp', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data || []);
  });
});

app.post('/leaderboard/paginated', (req, res) => {
  const {
    frame = 'all',
    page = 1,
    limit = 100,
    userId,
    sortBy = 'xp'
  } = req.body || {};

  console.log('📊 Leaderboard request:', { frame, page, limit, userId, sortBy });

  getPaginatedLeaderboard(frame, page, limit, sortBy, (err, players) => {
    if (err) {
      console.error('❌ Leaderboard error:', err);
      return res.status(500).json({ error: err.message });
    }

    getTotalPlayerCount(frame, (countErr, totalPlayers) => {
      if (countErr) {
        console.error('❌ Player count error:', countErr);
        return res.status(500).json({ error: countErr.message });
      }

      if (userId && userId !== 'guest') {
        Promise.all([
          new Promise(resolve => getUserRank(userId, 'xp', frame, (err, rank) => resolve(err ? 0 : rank))),
          new Promise(resolve => getUserRank(userId, 'lessons', frame, (err, rank) => resolve(err ? 0 : rank))),
          new Promise(resolve => getUserRank(userId, 'achievements', frame, (err, rank) => resolve(err ? 0 : rank))),
          new Promise(resolve => getUserStats(userId, frame, (err, stats) => resolve(err ? null : stats)))
        ]).then(([yourRank, yourLessonsRank, yourAchievementsRank, yourStats]) => {
          
          console.log('✅ Leaderboard response:', {
            frame,
            playersCount: players?.length || 0,
            totalPlayers,
            yourRank,
            yourLessonsRank,
            yourAchievementsRank,
            hasYourStats: !!yourStats,
            yourStatsPreview: yourStats ? { xp: yourStats.xp, lessons: yourStats.lessons, achievements: yourStats.achievements } : null
          });

          res.json({
            players: players || [],
            totalPlayers: totalPlayers || 0,
            yourRank: yourRank || 0,
            yourLessonsRank: yourLessonsRank || 0,
            yourAchievementsRank: yourAchievementsRank || 0,
            yourStats: yourStats ? {
              ...yourStats,
              id: yourStats.external_id || yourStats.id,
              globalRank: yourRank || 0,
              lessonsRank: yourLessonsRank || 0,
              achievementsRank: yourAchievementsRank || 0
            } : null
          });
        });
      } else {
        console.log('✅ Leaderboard response (no user):', {
          playersCount: players?.length || 0,
          totalPlayers
        });

        res.json({
          players: players || [],
          totalPlayers: totalPlayers || 0,
          yourRank: 0,
          yourLessonsRank: 0,
          yourAchievementsRank: 0,
          yourStats: null
        });
      }
    });
  });
});

app.post('/submit', (req, res) => {
  console.log('📝 Submit request:', req.body);
  
  upsertUserAndStats(req.body, (err, userId) => {
    if (err) {
      console.error('❌ Submit error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('✅ Submit success:', userId);
    
    setTimeout(emitLeaderboards, 100);
    
    res.json({ success: true, userId: userId || null });
  });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  emitLeaderboards();

  socket.on('leaderboard:get', (frameLabel) => {
    const frameMap = {
      'all time': 'all',
      'this month': 'month',
      'this week': 'week'
    };
    
    const frame = frameMap[frameLabel?.toLowerCase()] || 'all';
    
    getPaginatedLeaderboard(frame, 1, 100, 'xp', (err, data) => {
      if (!err && data) {
        socket.emit('leaderboard:update', {
          frame: frameLabel,
          data: data
        });
      } else if (err) {
        console.error('Error getting leaderboard for socket:', err);
        socket.emit('leaderboard:error', { error: err.message });
      }
    });
  });

  socket.on('score:submit', (payload) => {
    upsertUserAndStats(payload, (err) => {
      if (!err) {
        emitLeaderboards();
        socket.emit('score:success', { message: 'Score submitted successfully' });
      } else {
        console.error('Error submitting score via socket:', err);
        socket.emit('score:error', { error: err.message });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Leaderboard API + WebSocket server running on http://localhost:${PORT}`);
  console.log('📊 Database initialized with proper schema');
  console.log('🔄 Real-time updates enabled via Socket.IO');
  console.log(`🔍 Debug endpoint available at http://localhost:${PORT}/debug/:userId`);
});
