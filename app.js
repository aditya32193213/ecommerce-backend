/**
 * ============================================================
 * File: app.js
 * ------------------------------------------------------------
 * Purpose:
 * This file is responsible for configuring the Express
 * application. It sets up global middlewares, routes,
 * Swagger documentation, and centralized error handling.
 *
 * IMPORTANT DESIGN RULE (As per project requirement):
 * ----------------------------------------------------
 * ❌ Server is NOT started here
 * ❌ Database is NOT connected here
 *
 * This file strictly handles:
 * - Request & response flow
 * - Middleware configuration
 * - Route registration
 *
 * Server startup and DB connection are handled separately
 * in index.js to maintain clean separation of concerns.
 * ============================================================
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import helmet from "helmet";                 // Security HTTP headers
import mongoSanitize from "express-mongo-sanitize"; // Prevent NoSQL injection
import rateLimit from "express-rate-limit"; // Rate limiting for security

// Centralized API Router
import apiRoutes from "./routes/index.js";

// Custom Middlewares
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";

// Swagger Documentation
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

// Initialize Express app
const app = express();

/**
 * ============================================================
 * GLOBAL MIDDLEWARES
 * ============================================================
 */

// 1️⃣ Helmet – Adds security-related HTTP headers
app.use(helmet());

// Required when using Render / proxies
app.set("trust proxy", 1);

// 2️⃣ CORS Configuration
// Allows frontend to communicate with backend securely
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Restrict in production
    credentials: true,
  })
);

// 3️⃣ Rate Limiting
// Protects APIs from abuse and basic DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// 4️⃣ MongoDB Query Sanitization
// Prevents injection attacks like { "$gt": "" }
app.use(mongoSanitize());

// 5️⃣ Body Parser & Logging
// Limits payload size and logs incoming requests
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev")); // HTTP request logs
app.use(logger);        // Custom descriptive logs

/**
 * ============================================================
 * ROUTES & DOCUMENTATION
 * ============================================================
 */

// Swagger API Documentation
// Accessible at: /api/docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Main API routes (Rate-limited)
app.use("/api", limiter, apiRoutes);

// Health Check Route (Used by Render / Monitoring tools)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend running fine",
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API 🚀");
});

/**
 * ============================================================
 * GLOBAL ERROR HANDLER
 * ============================================================
 * Handles all uncaught errors in a centralized manner
 */
app.use(errorHandler);

export default app;
