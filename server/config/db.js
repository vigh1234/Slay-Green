const mongoose = require("mongoose");

// Connects to MongoDB using MONGODB_URI. The rest of the API (AI endpoints,
// payments, ...) doesn't need a database, so a missing/failed connection does
// not crash the server — the auth endpoints just answer 503 until it is up.
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not set — register/login are disabled.");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, isDbConnected };
