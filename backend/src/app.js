import "./config/env.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// Dynamic production-ready CORS configuration
const parseOrigins = (raw) => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, "").toLowerCase())
    .filter(Boolean);
};

const allowedOrigins = [
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.FRONTEND_URL),
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // In non-production environments or requests with no origin (curl, mobile, health checks, server-to-server), permit
      if (!origin || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, "").toLowerCase();

      // In production, enforce origin whitelist if origins are configured
      if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS policy.`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Health Check Endpoint
app.get("/health", (_req, res) => {
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbState = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "healthy" : "unhealthy",
    service: "Bikes Rental Service Backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || "unknown",
      host: mongoose.connection.host || null,
    },
  });
});

// Root informational endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "Bikes Rental Service API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      bikes: "/api/bikes",
      bookings: "/api/bookings",
      payments: "/api/payments",
      users: "/api/users",
      reviews: "/api/reviews",
      feedback: "/api/feedback",
      chat: "/api/chat",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
