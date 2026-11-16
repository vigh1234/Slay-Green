const jwt = require("jsonwebtoken");
const ContactMessage = require("../models/ContactMessage");
const { isDbConnected } = require("../config/db");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// If the sender happens to be signed in, remember who they are. A missing or
// invalid token is fine — the contact form is open to everyone.
const optionalUserId = (req) => {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token || !process.env.JWT_SECRET) return null;
    return jwt.verify(token, process.env.JWT_SECRET).sub;
  } catch {
    return null;
  }
};

// POST /api/v1/contact  { name, email, subject?, message }
const submitContact = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ error: "We can't take messages right now, please try again later" });
    }

    const { name, email, subject = "", message, website } = req.body || {};

    // Honeypot: real visitors never see or fill the hidden "website" field.
    // Pretend success so bots don't learn they were filtered.
    if (website) return res.status(201).json({ ok: true });

    if ([name, email, subject, message].some((v) => typeof v !== "string")) {
      return res.status(400).json({ error: "Please fill in your name, email and message" });
    }

    const clean = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    if (!clean.name || clean.name.length > 80) {
      return res.status(400).json({ error: "Please enter a valid name" });
    }
    if (!EMAIL_RE.test(clean.email) || clean.email.length > 254) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (clean.subject.length > 120) {
      return res.status(400).json({ error: "Subject must be 120 characters or fewer" });
    }
    if (clean.message.length < 10) {
      return res.status(400).json({ error: "Your message is a little short — please add some detail" });
    }
    if (clean.message.length > 4000) {
      return res.status(400).json({ error: "Message must be 4000 characters or fewer" });
    }

    await ContactMessage.create({ ...clean, user: optionalUserId(req) });
    return res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact };
