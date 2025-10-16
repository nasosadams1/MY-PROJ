const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables (in production, use proper env vars)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Database setup
const db = new sqlite3.Database('./auth.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      name TEXT NOT NULL,
      google_id TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      verification_code TEXT,
      verification_expires DATETIME,
      reset_token TEXT,
      reset_expires DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      coins INTEGER DEFAULT 0,
      total_coins_earned INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      completed_lessons TEXT DEFAULT '[]',
      level INTEGER DEFAULT 1,
      hearts INTEGER DEFAULT 5,
      max_hearts INTEGER DEFAULT 5,
      last_heart_reset TEXT,
      current_avatar TEXT DEFAULT 'default',
      owned_avatars TEXT DEFAULT '["default"]',
      unlocked_achievements TEXT DEFAULT '[]',
      current_streak INTEGER DEFAULT 1,
      last_login_date TEXT,
      total_lessons_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, code, name) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Codhak - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0;">Codhak</h1>
          <p style="color: #6B7280; margin: 5px 0;">Learn Programming, Level Up Your Skills</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; margin: 0 0 10px 0;">Welcome to Codhak, ${name}!</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 0;">Please verify your email to start your coding journey</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <p style="color: #374151; margin: 0 0 20px 0; font-size: 16px;">Your verification code is:</p>
          <div style="background: white; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #1F2937; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #6B7280; margin: 20px 0 0 0; font-size: 14px;">This code will expire in 10 minutes</p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p>If you didn't create an account with Codhak, please ignore this email.</p>
          <p style="margin-top: 20px;">Happy coding! 🚀</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Generate verification code
      const verificationCode = generateVerificationCode();
      const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Insert user
      db.run(
        'INSERT INTO users (email, password_hash, name, verification_code, verification_expires) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, name, verificationCode, verificationExpires.toISOString()],
        async function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;

          // Create user progress record
          db.run(
            'INSERT INTO user_progress (user_id, last_heart_reset, last_login_date) VALUES (?, ?, ?)',
            [userId, new Date().toDateString(), new Date().toDateString()],
            async (err) => {
              if (err) {
                console.error('Failed to create user progress:', err);
              }

              // Send verification email
              const emailSent = await sendVerificationEmail(email, verificationCode, name);
              
              if (!emailSent) {
                return res.status(500).json({ error: 'Failed to send verification email' });
              }

              res.status(201).json({
                message: 'User created successfully. Please check your email for verification code.',
                userId: userId
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email
app.post('/api/auth/verify', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  db.get(
    'SELECT id, name, verification_code, verification_expires FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.verification_code !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      if (new Date() > new Date(user.verification_expires)) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }

      // Mark user as verified
      db.run(
        'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires = NULL WHERE id = ?',
        [user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to verify user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: user.id, email: email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.json({
            message: 'Email verified successfully',
            token: token,
            user: {
              id: user.id,
              email: email,
              name: user.name
            }
          });
        }
      );
    }
  );
});

// Sign in
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(
    'SELECT id, email, password_hash, name, is_verified FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.is_verified) {
        return res.status(401).json({ error: 'Please verify your email before signing in' });
      }

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Signed in successfully',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }
  );
});

// Google OAuth sign in
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email not verified' });
    }

    // Check if user exists
    db.get('SELECT id, email, name FROM users WHERE email = ? OR google_id = ?', [email, googleId], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        // User exists, sign them in
        const token = jwt.sign(
          { userId: existingUser.id, email: existingUser.email, name: existingUser.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Signed in successfully with Google',
          token: token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name
          }
        });
      } else {
        // Create new user
        db.run(
          'INSERT INTO users (email, name, google_id, is_verified) VALUES (?, ?, ?, TRUE)',
          [email, name, googleId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }

            const userId = this.lastID;

            // Create user progress record
            db.run(
              'INSERT INTO user_progress (user_id, last_heart_reset, last_login_date) VALUES (?, ?, ?)',
              [userId, new Date().toDateString(), new Date().toDateString()],
              (err) => {
                if (err) {
                  console.error('Failed to create user progress:', err);
                }

                const token = jwt.sign(
                  { userId: userId, email: email, name: name },
                  JWT_SECRET,
                  { expiresIn: '7d' }
                );

                res.status(201).json({
                  message: 'Account created and signed in successfully with Google',
                  token: token,
                  user: {
                    id: userId,
                    email: email,
                    name: name
                  }
                });
              }
            );
          }
        );
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Get user progress
app.get('/api/user/progress', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(
    `SELECT up.*, u.name, u.email 
     FROM user_progress up 
     JOIN users u ON u.id = up.user_id 
     WHERE up.user_id = ?`,
    [userId],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!progress) {
        return res.status(404).json({ error: 'User progress not found' });
      }

      // Parse JSON fields
      const userProgress = {
        ...progress,
        completed_lessons: JSON.parse(progress.completed_lessons || '[]'),
        owned_avatars: JSON.parse(progress.owned_avatars || '["default"]'),
        unlocked_achievements: JSON.parse(progress.unlocked_achievements || '[]')
      };

      res.json(userProgress);
    }
  );
});

// Update user progress
app.put('/api/user/progress', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const progressData = req.body;

  // Convert arrays to JSON strings
  const updateData = {
    ...progressData,
    completed_lessons: JSON.stringify(progressData.completed_lessons || []),
    owned_avatars: JSON.stringify(progressData.owned_avatars || ['default']),
    unlocked_achievements: JSON.stringify(progressData.unlocked_achievements || []),
    updated_at: new Date().toISOString()
  };

  const fields = Object.keys(updateData).filter(key => key !== 'user_id' && key !== 'id');
  const values = fields.map(field => updateData[field]);
  const setClause = fields.map(field => `${field} = ?`).join(', ');

  db.run(
    `UPDATE user_progress SET ${setClause} WHERE user_id = ?`,
    [...values, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update progress' });
      }

      res.json({ message: 'Progress updated successfully' });
    }
  );
});

// Resend verification code
app.post('/api/auth/resend-verification', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get('SELECT id, name, is_verified FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    db.run(
      'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
      [verificationCode, verificationExpires.toISOString(), user.id],
      async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update verification code' });
        }

        const emailSent = await sendVerificationEmail(email, verificationCode, user.name);
        
        if (!emailSent) {
          return res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.json({ message: 'Verification code sent successfully' });
      }
    );
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});