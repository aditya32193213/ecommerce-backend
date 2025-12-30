import Favorite from "../models/favoriteModel.js";

// GET wishlist
export const getFavorites = async (req, res) => {
  const items = await Favorite.find({ user: req.user._id })
    .populate("product");
  res.json(items);
};

// ADD to wishlist
export const addToFavorite = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId required" });
  }

  const exists = await Favorite.findOne({
    user: req.user._id,
    product: productId,
  });

  if (exists) {
    return res.status(409).json({ message: "Already in wishlist" });
  }

  await Favorite.create({
    user: req.user._id,
    product: productId,
  });

  const updated = await Favorite.find({ user: req.user._id })
    .populate("product");

  res.status(201).json(updated);
};

// REMOVE from wishlist
export const removeFromFavorites = async (req, res) => {
  await Favorite.findOneAndDelete({
    user: req.user._id,
    product: req.params.productId,
  });

  const updated = await Favorite.find({ user: req.user._id })
    .populate("product");

  res.json(updated);
};
