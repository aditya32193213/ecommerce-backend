/**
 * ============================================================
 * File: productController.js
 * ------------------------------------------------------------
 * Purpose:
 * Handles all product-related operations including:
 * - Public product browsing (home/shop pages)
 * - Filtering, sorting, and pagination
 * - Category-based product listing
 * - Admin product management (CRUD)
 *
 * Design Notes:
 * - Public APIs return optimized (lite) payloads
 * - Admin APIs return full product objects
 * - Draft workflow supported via `isDraft`
 * ============================================================
 */

import Product from "../models/productModel.js";

// =====================================================================
// 1. GET ALL PRODUCTS (Public)
// Optimized for Home & Shop Pages (Lite Payload)
// =====================================================================
// - Get all products with pagination, filtering & sorting
// - GET /api/products?keyword=&category=&page=&limit=&sort=
export const getAllProducts = async (req, res) => {
  // Pagination defaults
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  /**
   * Search filter (case-insensitive title match)
   */
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: "i" } }
    : {};

  /**
   * Category filter
   */
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  /**
   * Price range filters
   */
  const minPrice = req.query.minPrice
    ? { price: { $gte: req.query.minPrice } }
    : {};
  const maxPrice = req.query.maxPrice
    ? { price: { $lte: req.query.maxPrice } }
    : {};

  /**
   * Sorting logic
   * Default: newest products first
   */
  let sortOption = { createdAt: -1 };
  if (req.query.sort === "price") sortOption = { price: 1 };
  if (req.query.sort === "rating") sortOption = { "rating.rate": -1 };

  /**
   * Merge all filters into a single query object
   */
  const filters = {
    ...keyword,
    ...category,
    ...minPrice,
    ...maxPrice,
  };

  // Total matching documents (for pagination)
  const count = await Product.countDocuments(filters);

  /**
   * Fetch optimized product list:
   * - Only fields required for listing pages
   * - `.lean()` improves read performance
   */
  const products = await Product.find(filters)
    .select("title price image category rating countInStock")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortOption)
    .lean();

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

// =====================================================================
// 2. GET SINGLE PRODUCT (Public)
// Optimized for Product Details Page (Full Payload)
// =====================================================================
// - Get single product by ID
// - GET /api/products/:id
export const getProductById = async (req, res) => {
  /**
   * Fetch full product data including description
   * Used on Product Details page
   */
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
};

// =====================================================================
// 3. CATEGORY OPERATIONS (Public)
// =====================================================================

// - Get all unique product categories
// - GET /api/products/categories
export const getAllCategories = async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
};

// - Get products by category
// - GET /api/products/category/:category
export const getProductsByCategory = async (req, res) => {
  /**
   * Category listings use lite payload
   * to reduce network overhead
   */
  const products = await Product.find({
    category: req.params.category,
  })
    .select("title price image category rating countInStock")
    .lean();

  res.json(products);
};

// =====================================================================
// 4. ADMIN PRODUCT MANAGEMENT
// =====================================================================

// - Delete product (Admin only)
// - DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
};

// - Create product (Admin only)
// - POST /api/products
export const createProduct = async (req, res) => {
  try {
    /**
     * Default values allow admin to create
     * draft products without full details
     */
    const {
      title = "title",
      category = "category",
      price = 0,
      image = "",
      description = "",
      countInStock = 0,
      isDraft = true,
    } = req.body;

    const product = new Product({
      title,
      category,
      price,
      image,
      description,
      countInStock,
      isDraft,
      user: req.user._id, // Track creator
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// - Update product (Admin only)
// - PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  /**
   * Safe updates:
   * - Prevents overwriting with undefined values
   */
  product.title = req.body.title ?? product.title;
  product.price = req.body.price ?? product.price;
  product.description = req.body.description ?? product.description;
  product.image = req.body.image ?? product.image;
  product.category = req.body.category ?? product.category;
  product.countInStock =
    req.body.countInStock !== undefined
      ? req.body.countInStock
      : product.countInStock;

  /**
   * Auto-publish product once edited by admin
   */
  product.isDraft = false;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};
