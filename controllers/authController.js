/**
 * ============================================================
 * File: authController.js
 * ------------------------------------------------------------
 * Purpose:
 * Handles user authentication workflows:
 * - Registration
 * - Login
 * - Forgot password (mock email)
 * - Reset password
 *
 * Security Notes:
 * - Emails are normalized to lowercase
 * - Password hashing handled via User model pre-save hook
 * - JWT used for stateless authentication
 * ============================================================
 */

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ------------------------------------------------------------
 * REGISTER USER
 * ------------------------------------------------------------
 * Creates a new user account after validating uniqueness
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Normalize email to avoid duplicates due to casing
  const normalizedEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  await User.create({
    name,
    email: normalizedEmail,
    password, // hashed automatically by model hook
  });

  res.status(201).json({ message: "User registered successfully" });
};

/**
 * ------------------------------------------------------------
 * LOGIN USER
 * ------------------------------------------------------------
 * Validates credentials and issues JWT token
 */
export const login = async (req, res) => {
  let { email, password } = req.body;

  // Normalize email before DB lookup
  email = email.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare plaintext password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
};

/**
 * ------------------------------------------------------------
 * FORGOT PASSWORD (Mock Email)
 * ------------------------------------------------------------
 * Generates short-lived reset token
 * Email sending is mocked via console log
 */
export const forgotPassword = async (req, res) => {
  const email = req.body.email.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  // Mock email output (no real email service used)
  const resetUrl = `https://lively-truffle-50078c.netlify.app/reset-password/${resetToken}`;
  console.log(`\n📢 [MOCK EMAIL] Reset Link: ${resetUrl}\n`);

  res.json({ message: "Password reset link sent" });
};

/**
 * ------------------------------------------------------------
 * RESET PASSWORD
 * ------------------------------------------------------------
 * Verifies token and updates password securely
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ❗ Do NOT hash manually — model hook handles it
    user.password = password;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
