import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";

// Import the Centralized Router
import apiRoutes from "./routes/index.js"; 

// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);

// ✅ MOUNT ALL ROUTES HERE
// This single line replaces all your manual app.use() calls
app.use("/api", apiRoutes);

// Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend running fine" });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API 🚀");
});

// Global Error Handler
app.use(errorHandler);

export default app;