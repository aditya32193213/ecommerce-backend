/**
 * ============================================================
 * File: cartValidator.js
 * ------------------------------------------------------------
 * Purpose:
 * Validates request payload for adding products to cart.
 *
 * Ensures:
 * - productId is present and valid
 * - quantity is a valid number (if provided)
 * ============================================================
 */

import mongoose from "mongoose";

/**
 * Middleware: validateAddToCart
 */
export const validateAddToCart = (req, res, next) => {
  const { productId, qty } = req.body;

  // Validate productId presence and format
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  // Validate quantity if provided
  if (qty !== undefined) {
    if (typeof qty !== "number" || qty < 1) {
      return res.status(400).json({
        message: "Quantity must be a number greater than or equal to 1",
      });
    }
  }

  next();
};
