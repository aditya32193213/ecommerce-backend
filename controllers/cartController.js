/**
 * ============================================================
 * File: cartController.js
 * ------------------------------------------------------------
 * Purpose:
 * Manages shopping cart functionality:
 * - Add items
 * - Update quantity
 * - Remove items
 * - Clear cart
 *
 * All routes are user-authenticated
 * ============================================================
 */

import Cart from "../models/cartModel.js";

/**
 * GET all cart items for logged-in user
 */
export const getCartItems = async (req, res) => {
  const items = await Cart.find({ user: req.user._id }).populate("product");
  res.json(items);
};

/**
 * ADD item to cart
 * - If item exists, increase quantity
 * - Else create new cart item
 */
export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  let item = await Cart.findOne({
    user: req.user._id,
    product: productId,
  });

  if (item) {
    item.qty += qty;
    await item.save();
  } else {
    await Cart.create({
      user: req.user._id,
      product: productId,
      qty,
    });
  }

  const updated = await Cart.find({ user: req.user._id }).populate("product");
  res.status(201).json(updated);
};

/**
 * UPDATE quantity of a cart item
 */
export const updateCartItem = async (req, res) => {
  const { qty } = req.body;

  await Cart.findOneAndUpdate(
    { user: req.user._id, product: req.params.productId },
    { qty }
  );

  const updated = await Cart.find({ user: req.user._id }).populate("product");
  res.json(updated);
};

/**
 * REMOVE item from cart
 */
export const removeCartItem = async (req, res) => {
  await Cart.findOneAndDelete({
    user: req.user._id,
    product: req.params.productId,
  });

  const updated = await Cart.find({ user: req.user._id }).populate("product");
  res.json(updated);
};

/**
 * CLEAR entire cart for user
 */
export const clearUserCart = async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.status(200).json([]);
};
