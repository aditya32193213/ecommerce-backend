import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Favorite from "../models/favoriteModel.js";
import Cart from "../models/cartModel.js";

// ===================================
// GET USER PROFILE
// ===================================
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    addresses: user.addresses || [],
  });
};

// ===================================
// UPDATE USER PROFILE
// ===================================
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email?.toLowerCase() || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  const token = jwt.sign(
    { id: updatedUser._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "30d" }
  );

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token,
    addresses: updatedUser.addresses || [],
  });
};

// ===================================
// ADD ADDRESS
// ===================================
export const saveAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.addresses = user.addresses || [];
  user.addresses.push(req.body);

  const updatedUser = await user.save();
  res.json({ message: "Address added", addresses: updatedUser.addresses });
};

// ===================================
// UPDATE ADDRESS
// ===================================
export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const address = user.addresses?.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  address.name = req.body.name || address.name;
  address.street = req.body.street || address.street;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.zip = req.body.zip || address.zip;
  address.country = req.body.country || address.country;
  address.phone = req.body.phone || address.phone;

  await user.save();
  res.json({ message: "Address updated", addresses: user.addresses });
};

// ===================================
// DELETE ADDRESS
// ===================================
export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.addresses = (user.addresses || []).filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );

  await user.save();
  res.json({ message: "Address removed", addresses: user.addresses });
};

// ===================================
// USER META (CART + WISHLIST COUNTS)
// ===================================
export const getUserMeta = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🛒 Cart: multiple docs, each with qty
    const cartDocs = await Cart.find({ user: userId });

    const cartCount = cartDocs.reduce(
      (sum, item) => sum + (item.qty || 0),
      0
    );

    // ❤️ Wishlist: one product per document
    const wishlistCount = await Favorite.countDocuments({
      user: userId,
    });

    res.status(200).json({
      cartCount,
      wishlistCount,
    });
  } catch (error) {
    console.error("Meta API error:", error);
    res.status(500).json({
      message: "Failed to fetch user meta",
    });
  }
};
