/**
 * ============================================================
 * File: dashboardRoutes.js
 * ------------------------------------------------------------
 * Purpose:
 * Defines routes related to dashboard data access.
 *
 * Responsibilities:
 * - Provide dashboard data for logged-in users
 * - Provide dashboard data for admin users
 *
 * Security:
 * - All routes are protected using JWT authentication
 * - Admin dashboard route additionally enforces admin role
 * ============================================================
 */

import express from "express";

// Authentication & authorization middleware
import { protect, admin } from "../middleware/authMiddleware.js";

// Dashboard controller handlers
import {
  getUserDashboard,
  getAdminDashboard,
} from "../controllers/dashboardController.js";

// Initialize Express router
const router = express.Router();

/**
 * ------------------------------------------------------------
 * @route   GET /api/dashboard
 * @access  Private (Authenticated User)
 * ------------------------------------------------------------
 * Description:
 * Returns dashboard data relevant to the logged-in user.
 * Typically includes:
 * - Order summary
 * - Recent activity
 * - User-specific statistics
 *
 * Middleware Flow:
 * protect → getUserDashboard
 */
router.get("/", protect, getUserDashboard);

/**
 * ------------------------------------------------------------
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin Only)
 * ------------------------------------------------------------
 * Description:
 * Returns administrative dashboard data.
 * Typically includes:
 * - Total users
 * - Total orders
 * - Revenue metrics
 * - Platform-level analytics
 *
 * Middleware Flow:
 * protect → admin → getAdminDashboard
 */
router.get("/admin", protect, admin, getAdminDashboard);

// Export router for use in app.js
export default router;
