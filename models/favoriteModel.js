import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
