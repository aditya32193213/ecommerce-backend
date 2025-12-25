import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    // NEW: Link this item to a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
  },
  { timestamps: true }
);

cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);