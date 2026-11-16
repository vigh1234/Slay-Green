const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects a route: expects "Authorization: Bearer <jwt>", loads the user and
// attaches it to req.user. Use it on any endpoint that needs a logged-in user:
//   router.get("/something", requireAuth, handler);
const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired, please sign in again" });
    }
    next(err);
  }
};

module.exports = { requireAuth };
