import Product from "../models/productModel.js";

// @desc    Get all products
export const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();
  res.status(200).json(products);
};

// @desc    Get unique categories
export const getAllCategories = async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
};

// @desc    Get products by category
export const getProductsByCategory = async (req, res) => {
  const products = await Product.find({ category: req.params.category }).lean();

  if (!products.length) {
    return res.status(404).json({ message: "No products found" });
  }

  res.json(products);
};

// @desc    Get product by ID
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
};

// @desc    Delete product (Admin)
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
export const updateProduct = async (req, res) => {
  const { title, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.title = title;
  product.price = price;
  product.description = description;
  product.image = image;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};
