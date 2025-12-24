// src/controllers/favoriteController.js
import Favorite from "../models/favoriteModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Add item to favorites
// @route   POST /api/favorites
export const addToFavorite = async (req, res) => {
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

// @desc    Remove item from favorites
// @route   DELETE /api/favorites/:productId
export const removeFromFavorites = async (req, res) => {
  const { productId } = req.params;

  try {
    const deleted = await Favorite.findOneAndDelete({ product: productId });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found in favorites" });
    }

    // Return updated list
    const favorites = await Favorite.find().populate("product").lean();
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};