import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";
import { getOpenAiDiagnostic } from "./config/env.js";
import { getOpenAIClient } from "./services/aiService.js";

const PORT = Number(process.env.PORT) || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[Bikes Rental Service API] Server running on http://localhost:${PORT}`);
      console.log(`[Bikes Rental Service API] Health check available at http://localhost:${PORT}/health`);

      // Safe startup diagnostic (never exposing secret keys)
      const diagnostic = getOpenAiDiagnostic();
      const openAiClient = getOpenAIClient();
      console.log(`[Bikes Rental Service API] OPENAI_API_KEY configured: ${diagnostic.isConfigured ? "YES" : "NO"}`);
      console.log(`[Bikes Rental Service API] OpenAI client initialized: ${openAiClient ? "YES" : "NO"}`);
      console.log(`[Bikes Rental Service API] OpenAI model: ${diagnostic.model}`);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Closing HTTP server gracefully...`);
      server.close(async () => {
        console.log("HTTP server closed.");
        try {
          const mongoose = (await import("mongoose")).default;
          await mongoose.connection.close(false);
          console.log("MongoDB connection closed.");
        } catch {
          // ignore error during exit
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
