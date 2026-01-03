/**
 * CartItem Schema
 * Represents a single product added to a user's cart
 */

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    // Reference to the user who owns the cart item
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the product added to cart
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Quantity of the product
    qty: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
  },
  { timestamps: true }
);

/**
 * Compound index to ensure:
 * - One product per user cart
 */
cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
