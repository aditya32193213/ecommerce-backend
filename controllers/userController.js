import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// @desc    Get user profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

// @desc    Update user profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email?.toLowerCase() || user.email;

  if (req.body.password) {
    user.password = req.body.password; // This triggers the pre-save hash
  }

  const updatedUser = await user.save();

  // Generate a fresh token with the updated info
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
    token: token, // Send new token to frontend
  });
};

// @desc    Save a new address
export const saveAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.addresses.push(req.body);
  await user.save();

  res.json(user.addresses);
};
