// import mongoose from "mongoose";

// const cartSchema= new mongoose.Schema({
//     productId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"Product",
//     },
//     quantity :{
//         type: Number,
//         default: 1,
//     }
// });

// export default mongoose.model("Cart", cartSchema);









// src/models/cartModel.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
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

export default mongoose.model("CartItem", cartItemSchema);
