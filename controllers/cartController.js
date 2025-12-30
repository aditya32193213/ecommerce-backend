import Cart from "../models/cartModel.js";

export const getCartItems = async (req, res) => {
  const items = await Cart.find({ user: req.user._id })
    .populate("product");
  res.json(items);
};

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

  const updated = await Cart.find({ user: req.user._id })
    .populate("product");

  res.status(201).json(updated);
};

export const updateCartItem = async (req, res) => {
  const { qty } = req.body;

  await Cart.findOneAndUpdate(
    { user: req.user._id, product: req.params.productId },
    { qty }
  );

  const updated = await Cart.find({ user: req.user._id })
    .populate("product");

  res.json(updated);
};

export const removeCartItem = async (req, res) => {
  await Cart.findOneAndDelete({
    user: req.user._id,
    product: req.params.productId,
  });

  const updated = await Cart.find({ user: req.user._id })
    .populate("product");

  res.json(updated);
};

export const clearUserCart = async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.status(200).json([]);
};