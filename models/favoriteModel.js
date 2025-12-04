import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
});

export default mongoose.model("Favorite", favoriteSchema);

