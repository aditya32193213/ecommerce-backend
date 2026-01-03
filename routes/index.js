/**
 * ============================================================
 * File: routes/index.js
 * ------------------------------------------------------------
 * Purpose:
 * This file acts as the central router for the application.
 * All feature-specific route modules (auth, users, products,
 * cart, orders, etc.) are imported and mounted here.
 *
 * Benefits of this approach:
 * - Keeps route definitions modular and organized
 * - Improves readability and maintainability
 * - Makes it easy to scale the application by adding new routes
 *
 * NOTE:
 * This file only defines route mappings.
 * Business logic is handled inside controllers.
 * ============================================================
 */

import express from "express";

// Import route modules (feature-based routing)
import authRoutes from "./authRoutes.js";         // Authentication & authorization
import userRoutes from "./userRoutes.js";         // User profile & admin user management
import productRoutes from "./productRoutes.js";   // Product browsing & admin product management
import cartRoutes from "./cartRoutes.js";         // Shopping cart operations
import orderRoutes from "./orderRoutes.js";       // Order creation & tracking
import paymentRoutes from "./paymentRoutes.js";   // Payment & Stripe-related APIs
import favoriteRoutes from "./favoriteRoutes.js"; // Favorites / wishlist management
import dashboardRoutes from "./dashboardRoutes.js"; // User & admin dashboard stats
import couponRoutes from "./couponRoutes.js";     // Coupon validation and discount APIs

// Initialize router instance
const router = express.Router();

/**
 * ------------------------------------------------------------
 * Route Registration
 * ------------------------------------------------------------
 * Each route module is mounted with a base path.
 * Example:
 *   /api/auth        → authRoutes
 *   /api/products    → productRoutes
 *
 * This ensures clean and predictable API endpoints.
 * ------------------------------------------------------------
 */

// Authentication routes (register, login, reset password)
router.use("/auth", authRoutes);

// User-related routes (profile, address, meta, admin operations)
router.use("/users", userRoutes);

// Product routes (list products, categories, admin CRUD)
router.use("/products", productRoutes);

// Cart routes (add to cart, update quantity, clear cart)
router.use("/cart", cartRoutes);

// Order routes (create order, order history, admin order management)
router.use("/orders", orderRoutes);

// Payment routes (Stripe payment intent & processing)
router.use("/payment", paymentRoutes);

// Favorites / wishlist routes
router.use("/favorites", favoriteRoutes);

// Dashboard routes (user dashboard & admin analytics)
router.use("/dashboard", dashboardRoutes);

// Coupon routes (apply and validate discount coupons)
router.use("/coupons", couponRoutes);

// Export the centralized router
export default router;
