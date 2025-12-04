// src/middleware/validators/favoriteValidator.js
import mongoose from "mongoose";

export const validateFavorite = (req, res, next) => {
  const { productId } = req.body;

  // Validate productId
  if (!productId || !mongoose.isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  next();
};
