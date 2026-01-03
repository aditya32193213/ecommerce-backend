/**
 * ============================================================
 * File: favoriteController.js
 * ------------------------------------------------------------
 * Purpose:
 * Handles wishlist (favorites) functionality for users.
 *
 * Features:
 * - Fetch user's wishlist
 * - Add product to wishlist
 * - Remove product from wishlist
 *
 * Notes:
 * - Duplicate wishlist entries are prevented
 * - All routes require authentication
 * ============================================================
 */

import Favorite from "../models/favoriteModel.js";

/**
 * ------------------------------------------------------------
 * GET FAVORITES
 * ------------------------------------------------------------
 * Returns all wishlist items for the logged-in user
 */
export const getFavorites = async (req, res) => {
  const items = await Favorite.find({ user: req.user._id }).populate("product");
  res.json(items);
};

/**
 * ------------------------------------------------------------
 * ADD TO FAVORITES
 * ------------------------------------------------------------
 * Adds a product to the user's wishlist
 * Guards against duplicate entries
 */
export const addToFavorite = async (req, res) => {
  const { productId } = req.body;

  // Basic request validation
  if (!productId) {
    return res.status(400).json({ message: "productId required" });
  }

  // Check if product already exists in wishlist
  const exists = await Favorite.findOne({
    user: req.user._id,
    product: productId,
  });

  if (exists) {
    return res.status(409).json({ message: "Already in wishlist" });
  }

  // Create new favorite entry
  await Favorite.create({
    user: req.user._id,
    product: productId,
  });

  // Return updated wishlist
  const updated = await Favorite.find({ user: req.user._id }).populate("product");
  res.status(201).json(updated);
};

/**
 * ------------------------------------------------------------
 * REMOVE FROM FAVORITES
 * ------------------------------------------------------------
 * Removes a product from the user's wishlist
 */
export const removeFromFavorites = async (req, res) => {
  await Favorite.findOneAndDelete({
    user: req.user._id,
    product: req.params.productId,
  });

  // Return updated wishlist after removal
  const updated = await Favorite.find({ user: req.user._id }).populate("product");
  res.json(updated);
};
