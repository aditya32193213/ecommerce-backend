import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Favorite from "../models/favoriteModel.js";
import Cart from "../models/cartModel.js";

// ===================================
// GET USER PROFILE
// ===================================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Normalize DB → Frontend
    const normalizedAddresses = (user.addresses || []).map((addr) => ({
      _id: addr._id,
      name: addr.name,
      phone: addr.phone,
      address: addr.street,          // 🔥 FIX
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,          // 🔥 FIX
      country: addr.country,
    }));

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: normalizedAddresses,
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

    const normalizedAddresses = (updatedUser.addresses || []).map((addr) => ({
      _id: addr._id,
      name: addr.name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: addr.country,
    }));

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token,
      addresses: normalizedAddresses,
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Normalize frontend → DB
    const normalizedAddress = {
      name: req.body.name || "",
      phone: req.body.phone || "",
      street: req.body.address || "",
      city: req.body.city || "",
      state: req.body.state || "",
      zip: req.body.postalCode || "",
      country: req.body.country || "India",
    };

    if (
      !normalizedAddress.street ||
      !normalizedAddress.city ||
      !normalizedAddress.state ||
      !normalizedAddress.zip
    ) {
      return res.status(400).json({
        message: "Incomplete address data",
      });
    }

    user.addresses.push(normalizedAddress);
    await user.save();

    const normalizedAddresses = user.addresses.map((addr) => ({
      _id: addr._id,
      name: addr.name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: addr.country,
    }));

    res.status(201).json({
      message: "Address saved successfully",
      addresses: normalizedAddresses,
    });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({
      message: "Failed to save address",
    });
  }
};

// ===================================
// UPDATE ADDRESS
// ===================================
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // ✅ Normalize frontend → DB
    address.name = req.body.name || address.name;
    address.phone = req.body.phone || address.phone;
    address.street = req.body.address || address.street;
    address.city = req.body.city || address.city;
    address.state = req.body.state || address.state;
    address.zip = req.body.postalCode || address.zip;
    address.country = req.body.country || address.country;

    await user.save();

    const normalizedAddresses = user.addresses.map((addr) => ({
      _id: addr._id,
      name: addr.name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: addr.country,
    }));

    res.json({
      message: "Address updated successfully",
      addresses: normalizedAddresses,
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    const normalizedAddresses = user.addresses.map((addr) => ({
      _id: addr._id,
      name: addr.name,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: addr.country,
    }));

    res.json({
      message: "Address deleted successfully",
      addresses: normalizedAddresses,
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

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartDocs = await Cart.find({ user: userId });

    const cartCount = cartDocs.reduce(
      (sum, item) => sum + (item.qty || 0),
      0
    );

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
