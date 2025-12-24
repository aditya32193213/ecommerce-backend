import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  // Create user
  const user = await User.create({ name, email, password });

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// @desc    Forgot Password (Mock Email)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate a temporary token (valid for 10 min)
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

  // In a real app, send this via Email (Nodemailer/SendGrid)
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
  console.log(`\n\n📢 [MOCK EMAIL] Password Reset Link: ${resetUrl}\n\n`);

  res.json({ message: "Password reset link sent (Check server console)" });
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      user.password = password; // Will be hashed by pre-save hook
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }
};