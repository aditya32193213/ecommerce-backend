import CartItem from "../models/cartModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Helper: Get full cart for the current logged-in user
const getUserCart = async (userId) => {
  return await CartItem.find({ user: userId })
    .populate("product")
    .lean();
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  // Input validation is already handled by 'validateAddToCart' middleware
  const { productId, qty = 1 } = req.body;
  const userId = req.user._id;

  // 1. Check Stock
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.countInStock < qty) {
    return res.status(400).json({
      message: `Not enough stock. Only ${product.countInStock} available.`,
    });
  }

  // 2. Add/Update Cart Logic
  let cartItem = await CartItem.findOne({ user: userId, product: productId });

  if (cartItem) {
    const newTotalQty = cartItem.qty + qty;
    
    // Check stock again for the total new quantity
    if (product.countInStock < newTotalQty) {
      return res.status(400).json({
        message: `Cannot add item. You have ${cartItem.qty} in cart and only ${product.countInStock} are in stock.`,
      });
    }

    cartItem.qty = newTotalQty;
    await cartItem.save();
  } else {
    await CartItem.create({
      user: userId,
      product: productId,
      qty,
    });
  }

  const items = await getUserCart(userId);
  res.status(201).json(items);
};

// @desc    Get all cart items
// @route   GET /api/cart
// @access  Private
export const getCartItems = async (req, res) => {
  const items = await getUserCart(req.user._id);
  res.status(200).json(items);
};

// @desc    Remove cart item
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const deleted = await CartItem.findOneAndDelete({
    user: userId,
    product: productId,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Item not found in your cart" });
  }

  const items = await getUserCart(userId);
  res.status(200).json(items);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
  const { productId } = req.params; // ✅ FIXED
  const { qty } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.countInStock < qty) {
    return res.status(400).json({
      message: `Not enough stock. Only ${product.countInStock} available.`,
    });
  }

  const cartItem = await CartItem.findOneAndUpdate(
    { product: productId, user: userId },
    { qty },
    { new: true }
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  const items = await getUserCart(userId);
  res.status(200).json(items);
};

// @desc    Clear cart for logged-in user
// @route   DELETE /api/cart
// @access  Private
export const clearUserCart = async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.status(200).json([]);
};
