const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const ecoHotelRoute = require("./routes/ecoHotelRoute");
const advancedEcoHotelRoute = require("./routes/advancedEcoHotelRoute");
const vehicleRoute = require("./routes/vehicleRoute");
const advancedVehicleRoute = require("./routes/advancedVehicleRoute");
const scanImageRoute = require("./routes/scanImageRoute");
const videoSearchRoute = require("./routes/videoSearchRoute");
const electronicSearchRoute = require("./routes/electronicSearchRoute");
const swappingCenterRoute = require("./routes/swappingCenterRoute");
const selectedProvidersRoute = require("./routes/selectedProvidersRoute");
const surveyRoute = require("./routes/surveyRoute");
const imageRoute = require("./routes/imageRoute");
const evStationRoute = require("./routes/evStationRoute");
const paymentRoute = require("./routes/paymentRoute");
const marketPlaceRoute = require("./routes/marketPlaceRoute");
const placesRoute = require("./routes/placesRoute"); // new: Google Places proxy for the web client
const adminAuthRoute = require("./routes/adminAuthRoute"); // new: server-side admin login check
const authRoute = require("./routes/authRoute"); // user register / login (MongoDB)
const contactRoute = require("./routes/contactRoute"); // contact form (MongoDB)
const { connectDB } = require("./config/db");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Security & middleware
// ---------------------------------------------------------------------------

// If the API runs behind a reverse proxy / load balancer (Render, Railway,
// Nginx, ...), set TRUST_PROXY=1 so rate limiting sees the real client IP.
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}

// Secure HTTP headers. CSP is left off here because this server can also
// serve the built React app (Stripe, Leaflet/OpenStreetMap tiles, ...); define
// a CSP at your host/CDN, or tune it here, once your production domains are known.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS: only origins listed in CLIENT_ORIGIN (comma-separated) may call the API
// from a browser. With it unset, cross-origin requests are rejected, which is
// fine for local dev (the Vite proxy) and single-process deployments.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));

// Image uploads arrive as base64 JSON, so the limit is configurable.
const bodyLimit = process.env.BODY_LIMIT || "15mb";
app.use(bodyParser.json({ limit: bodyLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: bodyLimit }));

// Health check, handy for uptime monitors / container orchestration.
// Registered before the rate limiter so monitors are never throttled.
app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

// Rate limiting: many endpoints call paid third-party APIs (Gemini, OpenAI,
// Stripe, ...), so cap how fast a single client can hit them.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again shortly." },
});
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});
// Brute-force protection for user sign-in / sign-up (per IP).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later." },
});
app.use("/api/v1/admin/login", adminLoginLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
// Contact form: a handful of messages per IP per hour is plenty.
app.use(
  "/api/v1/contact",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "You've sent several messages already — please try again later." },
  })
);
app.use("/api/v1", apiLimiter);

// API routes
app.use("/api/v1", ecoHotelRoute);
app.use("/api/v1", advancedEcoHotelRoute);
app.use("/api/v1", vehicleRoute);
app.use("/api/v1", advancedVehicleRoute);
app.use("/api/v1", scanImageRoute);
app.use("/api/v1", videoSearchRoute);
app.use("/api/v1", electronicSearchRoute);
app.use("/api/v1", swappingCenterRoute);
app.use("/api/v1", selectedProvidersRoute);
app.use("/api/v1", surveyRoute);
app.use("/api/v1", imageRoute);
app.use("/api/v1", evStationRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", marketPlaceRoute);
app.use("/api/v1", placesRoute);
app.use("/api/v1", adminAuthRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", contactRoute);

// Optionally serve the built React client (run `npm run build` in /client
// first). Lets you deploy client + server together as a single process;
// skip this entirely if you're hosting the client separately (e.g. Vercel/
// Netlify) and only need this as an API server.
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next(); // dist/ doesn't exist yet (client not built) — fall through to 404
  });
});

// Global error handler (must be registered last)
app.use(errorHandler);

connectDB();

app.listen(port, () => {
  console.log(`Slay Green API listening on port ${port}`);
});
