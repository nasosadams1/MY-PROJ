// server-auth.mjs
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-prod";
const JWT_EXPIRES = "7d";
const SALT_ROUNDS = 10;

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve(this);
  }));
}
function getSql(db, sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  }));
}

export function registerAuth(app, db) {
  // Ensure users table has auth columns (safe migrations)
  db.serialize(() => {
    // add columns if they don't exist (SQLite: we'll try to alter and ignore errors)
    try {
      db.run(`ALTER TABLE users ADD COLUMN password_hash TEXT`);
    } catch (e) {}
    try {
      db.run(`ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0`);
    } catch (e) {}
    try {
      db.run(`ALTER TABLE users ADD COLUMN verification_code TEXT`);
    } catch (e) {}
  });

  // helper: generate JWT
  const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  // Signup
  // body: { name, email (optional), password }
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, password, avatar = "👤", badge = "Beginner" } = req.body;
      if (!name || !password) return res.status(400).json({ error: "Name and password required" });

      // check existence
      const existing = await getSql(db, `SELECT id, password_hash FROM users WHERE name = ?`, [name]);
      if (existing && existing.password_hash) {
        return res.status(400).json({ error: "User already exists" });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      // upsert (insert or update)
      await runSql(db, `
        INSERT INTO users (name, avatar, badge, password_hash, is_verified)
        VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(name) DO UPDATE SET
          password_hash = excluded.password_hash,
          avatar = excluded.avatar,
          badge = excluded.badge,
          is_verified = 1
      `, [name, avatar, badge, password_hash]);

      const user = await getSql(db, `SELECT id, name, avatar, badge FROM users WHERE name = ?`, [name]);

      const token = signToken({ userId: user.id, name: user.name });
      return res.status(201).json({ message: "Account created", token, user });
    } catch (err) {
      console.error("signup error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Signin
  // body: { name, password }
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!name || !password) return res.status(400).json({ error: "Name and password required" });

      const userRow = await getSql(db, `SELECT id, name, password_hash, avatar, badge, is_verified FROM users WHERE name = ?`, [name]);
      if (!userRow || !userRow.password_hash) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // optional: require verification
      if (userRow.is_verified === 0) {
        return res.status(403).json({ error: "Please verify your account before signing in" });
      }

      const match = await bcrypt.compare(password, userRow.password_hash);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken({ userId: userRow.id, name: userRow.name });
      const user = {
        id: userRow.id,
        name: userRow.name,
        avatar: userRow.avatar,
        badge: userRow.badge,
      };
      return res.json({ message: "Signed in", token, user });
    } catch (err) {
      console.error("signin error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Simple middleware to protect routes
  async function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });
    try {
      const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  // /api/auth/me returns basic user info if token valid
  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const uid = req.user.userId;
      const row = await getSql(db, `SELECT id, name, avatar, badge FROM users WHERE id = ?`, [uid]);
      if (!row) return res.status(404).json({ error: "User not found" });
      return res.json({ user: row });
    } catch (err) {
      console.error("me error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // optional: signout handled client side by deleting token
}
