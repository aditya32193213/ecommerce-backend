// // src/controllers/productController.js
// import Product from "../models/productModel.js";

// // @desc    Get all products
// // @route   GET /api/products
// // @access  Public
// export const getAllProducts = async (req, res) => {
//   const products = await Product.find().lean();
//   res.status(200).json(products);
// };

// // @desc    Get products by category
// // @route   GET /api/products/:category
// // @access  Public
// export const getProductsByCategory = async (req, res) => {
//   const { category } = req.params;

//   const products = await Product.find({ category }).lean();

//   if (!products.length) {
//     return res.status(404).json({ message: "No products found for this category" });
//   }

//   res.status(200).json(products);
// };












// src/controllers/productController.js
import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unique product categories
// @route   GET /api/products/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category }).lean();

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/single/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
