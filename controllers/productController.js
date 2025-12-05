// src/controllers/productController.js
import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();
  res.status(200).json(products);
};

// @desc    Get products by category
// @route   GET /api/products/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  const products = await Product.find({ category }).lean();

  if (!products.length) {
    return res.status(404).json({ message: "No products found for this category" });
  }

  res.status(200).json(products);
};
