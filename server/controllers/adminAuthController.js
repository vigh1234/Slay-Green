const crypto = require("crypto");

// Constant-time string comparison. Both values are hashed first so the buffers
// always have equal length (timingSafeEqual throws on length mismatch) and the
// comparison time doesn't reveal how much of the input matched.
const safeEqual = (a, b) => {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

// Server-side admin login check. Credentials come from environment variables
// (ADMIN_EMAIL / ADMIN_PASSWORD) and are never shipped in the client bundle.
//
// NOTE: this is still just a lightweight gate (a single shared password, no
// sessions/tokens) suitable for hiding an internal admin toggle screen. Swap in
// real authentication (signed sessions/JWT, a users table) before protecting
// anything sensitive. The route is rate-limited in Server.js.
const adminLogin = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return res.status(503).json({ error: "Admin login is not configured on the server" });
  }

  // Evaluate both comparisons so timing doesn't reveal which field was wrong.
  const emailOk = safeEqual(email, expectedEmail);
  const passwordOk = safeEqual(password, expectedPassword);

  if (emailOk && passwordOk) {
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(401).json({ error: "Incorrect username or password" });
};

module.exports = { adminLogin };
