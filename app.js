import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import helmet from "helmet"; // Security Headers
import mongoSanitize from "express-mongo-sanitize"; // Prevent NoSQL Injection
import rateLimit from "express-rate-limit"; // Rate limiting

// Import the Centralized Router
import apiRoutes from "./routes/index.js"; 

// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

const app = express();

// --- GLOBAL MIDDLEWARES ---

// 1. Security Headers (Helmet)
// Helps secure your apps by setting various HTTP headers
app.use(helmet());
app.set("trust proxy", 1);
// 2. CORS
// In production, strictly define 'origin' instead of allowing all '*'
app.use(cors({
  origin: process.env.CLIENT_URL || "*", // Fallback to * for dev
  credentials: true,
}));

// 3. Rate Limiting
// Limits requests from the same IP (Basic DDoS protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use("/api", limiter);

// 4. Data Sanitization
// Prevents MongoDB Operator Injection (e.g. {"$gt": ""})
app.use(mongoSanitize());

// 5. Body Parsing & Logging
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent DoS
app.use(morgan("dev"));
app.use(logger);

// --- ROUTES ---

// Swagger Documentation
// Note: Place this before the API routes if you want docs to be publicly accessible without rate limits, 
// or keep here if you want them limited.
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount All Routes
app.use("/api", apiRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend running fine" });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API 🚀");
});

// --- ERROR HANDLING ---
app.use(errorHandler);

export default app;