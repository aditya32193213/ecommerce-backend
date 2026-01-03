/**
 * ============================================================
 * File: favoriteValidator.js
 * ------------------------------------------------------------
 * Purpose:
 * Validates request payload for adding a product to favorites.
 *
 * Ensures:
 * - productId exists
 * - productId is a valid MongoDB ObjectId
 * ============================================================
 */

import mongoose from "mongoose";

/**
 * Middleware: validateFavorite
 */
export const validateFavorite = (req, res, next) => {
  const { productId } = req.body;

  // Validate productId presence and format
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  next();
};
