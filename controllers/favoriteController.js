import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Helper: Get favorites for CURRENT USER only
const getUserFavorites = async (userId) => {
  return await Favorite.find({ user: userId }).populate("product").lean();
};

// @desc    Add item to favorites
// @route   POST /api/favorites
export const addToFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // <--- Get User ID

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if THIS user already has this favorite
  const exists = await Favorite.findOne({ user: userId, product: productId });
  
  if (!exists) {
    await Favorite.create({ 
        user: userId, // <--- Save User ID
        product: productId 
    });
  }

  // Return full updated list for this user
  const items = await getUserFavorites(userId);
  res.status(201).json(items);
};

// @desc    Get all favorite items
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
  const userId = req.user._id;
  const items = await getUserFavorites(userId); // <--- Filter by User
  res.status(200).json(items);
};

// @desc    Remove item from favorites
// @route   DELETE /api/favorites/:productId
export const removeFromFavorites = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    // Delete only if it belongs to this user
    const deleted = await Favorite.findOneAndDelete({ 
        user: userId, 
        product: productId 
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found in favorites" });
    }

    const favorites = await getUserFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};