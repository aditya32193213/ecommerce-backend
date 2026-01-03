/**
 * ============================================================
 * File: authMiddleware.js
 * ------------------------------------------------------------
 * Purpose:
 * This middleware handles authentication and authorization
 * using JSON Web Tokens (JWT).
 *
 * Responsibilities:
 * - Verify JWT token from request headers
 * - Attach authenticated user to request object
 * - Restrict access to admin-only routes
 * ============================================================
 */

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * ------------------------------------------------------------
 * Middleware: protect
 * ------------------------------------------------------------
 * Ensures that the incoming request is made by an authenticated
 * user by validating the JWT token.
 *
 * Token is expected in the Authorization header:
 *   Authorization: Bearer <token>
 * ------------------------------------------------------------
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token using JWT secret
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );

      // Fetch user from database (exclude password)
      const user = await User.findById(decoded.id).select("-password");

      /**
       * Extra safety check:
       * If user no longer exists in database
       */
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request object
      req.user = user;
      next();
      return;
    } catch (error) {
      // Token verification failed
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token provided
  return res.status(401).json({ message: "Not authorized, no token" });
};

/**
 * ------------------------------------------------------------
 * Middleware: admin
 * ------------------------------------------------------------
 * Restricts access to admin-only routes.
 * Should be used AFTER protect middleware.
 * ------------------------------------------------------------
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};
