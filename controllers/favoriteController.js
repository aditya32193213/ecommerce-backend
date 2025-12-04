// import Favorite from "../models/favoriteModel.js";

// // Add Products to the favourites
// export const addToFavorites = async (req, res)=>{
//     const {productId} =req.body;
//     const favItem =new Favorite({ productId });
//     await favItem.save();
//     res.status(201).json({message:"Product Added to the favorite"})
// };

// //Get all favorite items                      
// export const getFavorites =async (req, res) =>{
//     const favorites= await Favorite.find().populate("productId");
//     res.json(favorites);
// }  






// src/controllers/favoriteController.js
import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Add item to favorites
// @route   POST /api/favorites
export const addFavorite = async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  // Ensure product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Prevent duplicates
  const exists = await Favorite.findOne({ product: productId });
  if (exists) {
    return res.status(200).json({
      message: "Already in favorites",
      item: exists,
    });
  }

  const fav = await Favorite.create({ product: productId });

  res.status(201).json({
    message: "Added to favorites",
    item: fav,
  });
};

// @desc    Get all favorite items
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
  const items = await Favorite.find()
    .populate("product")
    .lean();

  res.status(200).json(items);
};
