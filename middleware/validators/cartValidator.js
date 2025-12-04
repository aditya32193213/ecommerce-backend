// src/middleware/validators/cartValidator.js
import mongoose from "mongoose";

export const validateAddToCart = (req, res, next) => {
  const { productId, qty } = req.body;

  // Validate productId
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  // Validate qty
  if (qty !== undefined) {
    if (typeof qty !== "number" || qty < 1) {
      return res.status(400).json({
        message: "Quantity must be a number greater than or equal to 1",
      });
    }
  }

  next();
};
