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
  const userId = req.user._id; 

  // 1. Validate Product ID format
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  // 2. Ensure product actually exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 3. STOCK CHECK (New Fix)
  // Check if requested quantity exceeds available stock immediately
  if (product.countInStock < qty) {
    return res.status(400).json({ 
        message: `Not enough stock. Only ${product.countInStock} available.` 
    });
  }

  // 4. Check if this specific user already has this item
  let cartItem = await CartItem.findOne({ user: userId, product: productId });

  if (cartItem) {
    // 5. CUMULATIVE STOCK CHECK (New Fix)
    // If they already have 2 and want to add 3, make sure we have 5 total
    const newTotalQty = cartItem.qty + qty;
    if (product.countInStock < newTotalQty) {
        return res.status(400).json({ 
            message: `Cannot add item. You have ${cartItem.qty} in cart and only ${product.countInStock} are in stock.` 
        });
    }

    // Update existing quantity
    cartItem.qty = newTotalQty;
    await cartItem.save();
  } else {
    // Create new cart entry linked to this user
    await CartItem.create({
      user: userId,
      product: productId,
      qty,
    });
  }

  // 6. Return the full updated list
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
  // 'id' in the URL is the PRODUCT ID
  const { id } = req.params; 
  const { qty } = req.body;
  const userId = req.user._id;

  try {
    // 1. Fetch product to check stock availability (New Fix)
    const product = await Product.findById(id);
    
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // 2. Validate Stock before updating
    if (product.countInStock < qty) {
        return res.status(400).json({ 
            message: `Not enough stock. Only ${product.countInStock} available.` 
        });
    }

    // 3. Perform Update
    const cartItem = await CartItem.findOneAndUpdate(
      { product: id, user: userId }, 
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