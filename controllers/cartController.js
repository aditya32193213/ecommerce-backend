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
  const { productId, qty = 1 } = req.body;
  const userId = req.user._id; // Retrieved from 'protect' middleware

  // 1. Validate Product ID format
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  // 2. Ensure product actually exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 3. Check if this specific user already has this item
  let cartItem = await CartItem.findOne({ user: userId, product: productId });

  if (cartItem) {
    // Update existing quantity
    cartItem.qty += qty;
    await cartItem.save();
  } else {
    // Create new cart entry linked to this user
    await CartItem.create({
      user: userId,
      product: productId,
      qty,
    });
  }

  // 4. Return the full updated list
  const items = await getUserCart(userId);
  res.status(201).json(items);
};

// @desc    Get all cart items
// @route   GET /api/cart
// @access  Private
export const getCartItems = async (req, res) => {
  const userId = req.user._id;
  const items = await getUserCart(userId);
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

  // Delete item matching BOTH the user and the product
  const deleted = await CartItem.findOneAndDelete({ 
    user: userId, 
    product: productId 
  });

  if (!deleted) {
    return res.status(404).json({ message: "Item not found in your cart" });
  }

  // Return the full updated list
  const items = await getUserCart(userId);
  res.status(200).json(items);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
  // We now expect 'id' in the URL to be the PRODUCT ID, not CartItem ID
  const { id } = req.params; 
  const { qty } = req.body;
  const userId = req.user._id;

  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { product: id, user: userId }, // Find by Product + User
      { qty },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Return the full updated list
    const items = await getUserCart(userId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};