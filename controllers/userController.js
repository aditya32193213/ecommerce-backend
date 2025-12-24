import User from "../models/userModel.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if sent
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: req.token, // Keep the same token
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Save a new address
// @route   POST /api/users/address
// @access  Private
export const saveAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const newAddress = req.body; // { name, street, city... }
    user.addresses.push(newAddress);
    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};