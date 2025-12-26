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

cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);