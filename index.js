/**
 * ============================================================
 * File: index.js
 * ------------------------------------------------------------
 * Purpose:
 * This is the main entry point of the application.
 * It is responsible for:
 * - Loading environment variables
 * - Connecting to the database
 * - Starting the HTTP server
 *
 * This file follows best practices by keeping:
 * - Server startup logic here
 * - Application configuration in app.js
 * ============================================================
 */

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

import app from "./app.js";
import connectDB from "./config/db.js";

// Define server port
const PORT = process.env.PORT || 10000;

/**
 * ============================================================
 * START SERVER FUNCTION
 * ============================================================
 * Handles database connection and server startup safely
 */
const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    /**
     * 3️⃣ Handle Unhandled Promise Rejections
     * ----------------------------------------------------------
     * Example cases:
     * - MongoDB connection drops
     * - Invalid credentials
     *
     * The server is closed gracefully and the process exits,
     * allowing hosting platforms like Render to restart it.
     */
    process.on("unhandledRejection", (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    // Handles startup failures
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Initialize the application
startServer();
