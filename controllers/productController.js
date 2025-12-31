import Product from "../models/productModel.js";

// =====================================================================
// 1. GET ALL PRODUCTS (Public)
// Optimized for Home & Shop Pages (Lite Payload)
// =====================================================================
// @desc    Get all products with pagination and search
// @route   GET /api/products?keyword=abc&page=1&limit=12
  export const getAllProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const minPrice = req.query.minPrice ? { price: { $gte: req.query.minPrice } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: req.query.maxPrice } } : {};

  let sortOption = { createdAt: -1 };
  if (req.query.sort === "price") sortOption = { price: 1 };
  if (req.query.sort === "rating") sortOption = { "rating.rate": -1 };

  const filters = { ...keyword, ...category, ...minPrice, ...maxPrice };

  const count = await Product.countDocuments(filters);

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
// Optimized for Details Page (Heavy Payload)
// =====================================================================
// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  // ✅ Fetch EVERYTHING (including description) for the details page
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
};

// =====================================================================
// 3. CATEGORY LOGIC
// =====================================================================
// @desc    Get unique categories
// @route   GET /api/products/categories
export const getAllCategories = async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
export const getProductsByCategory = async (req, res) => {
  const products = await Product.find({ category: req.params.category })
    .select("title price image category rating countInStock") // Optimized for lists
    .lean();
  res.json(products);
};

// =====================================================================
// 4. ADMIN OPERATIONS
// =====================================================================
// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
};

// @desc    Create product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const product = new Product({
    title: "Sample Product",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    category: "Sample Category",
    countInStock: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { title, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};