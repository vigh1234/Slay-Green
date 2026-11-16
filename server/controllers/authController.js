const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isDbConnected } = require("../config/db");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores everything past 72 bytes

// A valid hash compared against when the email is unknown, so "no such user"
// and "wrong password" take about the same time (prevents user enumeration).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

// Guard shared by every handler: needs a DB connection and a signing secret.
const ensureConfigured = (res) => {
  if (!process.env.JWT_SECRET) {
    res.status(503).json({ error: "Authentication is not configured on the server" });
    return false;
  }
  if (!isDbConnected()) {
    res.status(503).json({ error: "Database is unavailable, please try again later" });
    return false;
  }
  return true;
};

// POST /api/v1/auth/register  { name, email, password }
const register = async (req, res, next) => {
  try {
    if (!ensureConfigured(res)) return;

    const { name, email, password } = req.body || {};
    // typeof checks also block NoSQL-injection payloads like { "$gt": "" }
    if ([name, email, password].some((v) => typeof v !== "string")) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 80) {
      return res.status(400).json({ error: "Please enter a valid name" });
    }
    if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters` });
    }

    if (await User.exists({ email: cleanEmail })) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const hash = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await User.create({ name: cleanName, email: cleanEmail, password: hash });
    } catch (err) {
      // Two simultaneous sign-ups with the same email: the unique index wins.
      if (err.code === 11000) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      throw err;
    }

    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login  { email, password }
const login = async (req, res, next) => {
  try {
    if (!ensureConfigured(res)) return;

    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const ok = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !ok) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/me  (requires a valid Bearer token)
const me = (req, res) => res.json({ user: publicUser(req.user) });

module.exports = { register, login, me };
