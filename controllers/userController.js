import User from "../models/userModel.js"; // ✅ FIXED (WAS MISSING)
import jwt from "jsonwebtoken";
import Favorite from "../models/favoriteModel.js";
import Cart from "../models/cartModel.js";

// ===================================
// HELPER: Normalize frontend → DB
// ===================================
const normalizeIncomingAddress = (body) => ({
  name: body.name || "",
  phone: body.phone || "",
  street: body.address || body.street || "",
  city: body.city || "",
  state: body.state || "",
  zip: body.postalCode || body.zip || "",
  country: body.country || "India",
});

// ===================================
// HELPER: Normalize DB → Frontend
// ===================================
const normalizeOutgoingAddress = (addr = {}) => ({
  _id: addr._id,
  name: addr.name || "",
  phone: addr.phone || "",
  address: addr.street || "",
  city: addr.city || "",
  state: addr.state || "",
  postalCode: addr.zip || "",
  country: addr.country || "India",
});

// ===================================
// GET USER PROFILE
// ===================================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: (user.addresses || []).map(normalizeOutgoingAddress),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ===================================
// UPDATE USER PROFILE
// ===================================
export const updateUserProfile = async (req, res) => {
  try {
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
      addresses: updatedUser.addresses.map(normalizeOutgoingAddress),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// ===================================
// ADD ADDRESS
// ===================================
export const saveAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = normalizeIncomingAddress(req.body);

    // ✅ Relaxed but correct validation
    if (!address.street || !address.city || !address.zip) {
      return res.status(400).json({
        message: "Incomplete address data",
      });
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json({
      message: "Address saved successfully",
      addresses: user.addresses.map(normalizeOutgoingAddress),
    });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({ message: "Failed to save address" });
  }
};

// ===================================
// UPDATE ADDRESS
// ===================================
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const updated = normalizeIncomingAddress(req.body);

    address.name = updated.name || address.name;
    address.phone = updated.phone || address.phone;
    address.street = updated.street || address.street;
    address.city = updated.city || address.city;
    address.state = updated.state || address.state;
    address.zip = updated.zip || address.zip;
    address.country = updated.country || address.country;

    await user.save();

    res.json({
      message: "Address updated successfully",
      addresses: user.addresses.map(normalizeOutgoingAddress),
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// ===================================
// DELETE ADDRESS
// ===================================
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses.map(normalizeOutgoingAddress),
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

// ===================================
// USER META (CART + WISHLIST COUNTS)
// ===================================
export const getUserMeta = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cartDocs = await Cart.find({ user: userId });
    const cartCount = cartDocs.reduce(
      (sum, item) => sum + (item.qty || 0),
      0
    );

    const wishlistCount = await Favorite.countDocuments({ user: userId });

    res.status(200).json({ cartCount, wishlistCount });
  } catch (error) {
    console.error("Meta API error:", error);
    res.status(500).json({ message: "Failed to fetch user meta" });
  }
};


export const getAdminUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } }
          ]
        }
      : {};

    const [count, users] = await Promise.all([
      User.countDocuments(keyword),
      User.find(keyword)
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .lean() // ✅ performance optimization
    ]);

    res.json({
      users,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};