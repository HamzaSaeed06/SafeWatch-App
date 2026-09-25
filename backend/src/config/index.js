require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  deviceSecretLength: parseInt(process.env.DEVICE_SECRET_LENGTH, 10) || 32,
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  ping: {
    maxPerBandPer5s: 1,
    maxSosPerBandPer30s: 1,
    reconnectTimeoutMs: 60000,
  },
};

module.exports = config;
