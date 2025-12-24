import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);