// import Cart from "../models/cartModel.js";

// //Add all the products 
// export const addToCart = async(req ,res)=>{
//     const {productId, quantity} = req.body;
//     const cartItem= new Cart({productId, quantity});
//     await cartItem.save();
//     res.status(201).json({message:"Product added to cart"});
// };

// //Get All cart items
// export const getCartItems =async (req, res)=>{
//     const items =await Cart.find().populate("productId");
//     res.json(items);

// };













// src/controllers/cartController.js
import CartItem from "../models/cartModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public (for capstone)
export const addToCart = async (req, res) => {
  const { productId, qty = 1 } = req.body;

  // Validate ObjectId format
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId format" });
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if already in cart
  let cartItem = await CartItem.findOne({ product: productId });

  if (cartItem) {
    cartItem.qty += qty;
    await cartItem.save();
    return res.status(200).json({
      message: "Quantity updated in cart",
      item: cartItem,
    });
  }

  // Create new cart entry
  cartItem = await CartItem.create({
    product: productId,
    qty,
  });

  res.status(201).json({
    message: "Item added to cart",
    item: cartItem,
  });
};

// @desc    Get all cart items
// @route   GET /api/cart
export const getCartItems = async (req, res) => {
  const items = await CartItem.find()
    .populate("product")
    .lean();

  res.status(200).json(items);
};

// @desc    Remove cart item
// @route   DELETE /api/cart/:id
export const removeCartItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid cart item ID" });
  }

  const deleted = await CartItem.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  res.status(200).json({
    message: "Item removed from cart",
  });
};
