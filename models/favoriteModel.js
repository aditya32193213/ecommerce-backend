// import mongoose from "mongoose";

// const favoriteSchema = new mongoose.Schema({
//     productId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//     },
// });

// export default mongoose.model("Favorite", favoriteSchema);









// src/models/favoriteModel.js
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
