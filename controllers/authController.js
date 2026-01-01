import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Normalize email
  const normalizedEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  // 🔒 Normalize email before lookup
  email = email.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not configured");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "secret",
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

// @desc    Forgot Password (Mock Email)
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

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  console.log(`\n📢 [MOCK EMAIL] Reset Link: ${resetUrl}\n`);

  res.json({ message: "Password reset link sent" });
};

export const resetPassword = async (req, res) => {
  try {
    let { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    // ✅ IMPORTANT: decode token (fixes %3D issue)
    token = decodeURIComponent(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

