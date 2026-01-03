/**
 * Favorite Schema
 * Stores products marked as favorites by users
 */

import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    // User who favorited the product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Favorited product reference
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate favorites per user
 */
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
