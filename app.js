import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";

// Routes
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";
import  logger  from "./middleware/logger.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupons", couponRoutes);

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
