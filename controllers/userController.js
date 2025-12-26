
// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// // ========================================
// // GET USER PROFILE
// // ========================================
// export const getUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//     addresses: user.addresses || [],
//   });
// };

// // ========================================
// // UPDATE USER PROFILE
// // ========================================
// export const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   user.name = req.body.name || user.name;
//   user.email = req.body.email?.toLowerCase() || user.email;

//   if (req.body.password) {
//     user.password = req.body.password;
//   }

//   const updatedUser = await user.save();

//   const token = jwt.sign(
//     { id: updatedUser._id },
//     process.env.JWT_SECRET || "secret",
//     { expiresIn: "30d" }
//   );

//   res.json({
//     _id: updatedUser._id,
//     name: updatedUser.name,
//     email: updatedUser.email,
//     isAdmin: updatedUser.isAdmin,
//     token,
//   });
// };

// // ========================================
// // ADD ADDRESS
// // ========================================
// export const saveAddress = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newAddress = {
//       name: req.body.name,
//       street: req.body.street,
//       city: req.body.city,
//       state: req.body.state,
//       zip: req.body.zip,
//       phone: req.body.phone,
//       country: req.body.country || "India",
//     };

//     user.addresses.push(newAddress);
//     await user.save();

//     res.status(201).json({
//       message: "Address saved successfully",
//       addresses: user.addresses,
//     });
//   } catch (error) {
//     console.error("Save address error:", error);
//     res.status(500).json({ message: "Failed to save address" });
//   }
// };

// // ========================================
// // UPDATE ADDRESS  ✅ FIXED
// // ========================================
// export const updateAddress = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const index = user.addresses.findIndex(
//       (addr) => addr._id.toString() === req.params.addressId
//     );

//     if (index === -1) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     user.addresses[index] = {
//       ...user.addresses[index],
//       ...req.body,
//     };

//     await user.save();

//     res.json({
//       message: "Address updated",
//       addresses: user.addresses,
//     });
//   } catch (error) {
//     console.error("Update address error:", error);
//     res.status(500).json({ message: "Failed to update address" });
//   }
// };

// // ========================================
// // DELETE ADDRESS  ✅ FIXED
// // ========================================
// export const deleteAddress = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.addresses = user.addresses.filter(
//       (addr) => addr._id.toString() !== req.params.addressId
//     );

//     await user.save();

//     res.json({
//       message: "Address deleted",
//       addresses: user.addresses,
//     });
//   } catch (error) {
//     console.error("Delete address error:", error);
//     res.status(500).json({ message: "Failed to delete address" });
//   }
// };


import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    addresses: user.addresses || [],
  });
};

// @desc    Update user profile (Name, Email, Password)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email?.toLowerCase() || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  // Generate new token in case critical info changed
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
    addresses: updatedUser.addresses,
  });
};

// @desc    Add a new address
// @route   POST /api/users/address
// @access  Private
export const saveAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Push new address to the array
  user.addresses.push(req.body);
  
  const updatedUser = await user.save();
  res.json({ message: "Address added", addresses: updatedUser.addresses });
};

// @desc    Update an existing address
// @route   PUT /api/users/address/:addressId
// @access  Private
export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  // Update fields
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

// @desc    Delete an address
// @route   DELETE /api/users/address/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Filter out the address to delete
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );

  await user.save();
  res.json({ message: "Address removed", addresses: user.addresses });
};