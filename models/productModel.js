/**
 * Product Schema
 * Stores product information listed in the application
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Admin user who created the product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },

    // Draft flag for admin product workflow
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
