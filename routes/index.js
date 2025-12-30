// src/routes/index.js
import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js"

const router = express.Router();

// Define all parent routes here
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;