// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// // @desc    Get user profile
// export const getUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // ✅ INCLUDE ADDRESSES
//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//     addresses: user.addresses || [],
//   });
// };

// // @desc    Update user profile
// export const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
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

// // @desc    Save a new address
// export const saveAddress = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // ✅ EXPLICIT FIELD MAPPING + DEFAULT COUNTRY
//   const newAddress = {
//     name: req.body.name,
//     street: req.body.street,
//     city: req.body.city,
//     state: req.body.state,
//     zip: req.body.zip,
//     phone: req.body.phone,
//     country: req.body.country || "India",
//   };

//   user.addresses.push(newAddress);
//   await user.save(); // 🔥 THIS IS WHAT ACTUALLY PERSISTS DATA

//   res.status(201).json({
//     message: "Address saved successfully",
//     addresses: user.addresses,
//   });
// };

// // @desc    Update an address
// export const updateAddress = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const address = user.addresses.id(req.params.addressId);
//   if (!address) {
//     res.status(404);
//     throw new Error("Address not found");
//   }

//   Object.assign(address, req.body);
//   await user.save();

//   res.json({
//     message: "Address updated",
//     addresses: user.addresses,
//   });
// };

// // @desc    Delete an address
// export const deleteAddress = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   user.addresses = user.addresses.filter(
//     (addr) => addr._id.toString() !== req.params.addressId
//   );

//   await user.save();

//   res.json({
//     message: "Address deleted",
//     addresses: user.addresses,
//   });
// };



import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// ========================================
// GET USER PROFILE
// ========================================
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

// ========================================
// UPDATE USER PROFILE
// ========================================
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
  });
};

// ========================================
// ADD ADDRESS
// ========================================
export const saveAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = {
      name: req.body.name,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      phone: req.body.phone,
      country: req.body.country || "India",
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: "Address saved successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({ message: "Failed to save address" });
  }
};

// ========================================
// UPDATE ADDRESS  ✅ FIXED
// ========================================
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.addresses.findIndex(
      (addr) => addr._id.toString() === req.params.addressId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[index] = {
      ...user.addresses[index],
      ...req.body,
    };

    await user.save();

    res.json({
      message: "Address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// ========================================
// DELETE ADDRESS  ✅ FIXED
// ========================================
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

    res.json({
      message: "Address deleted",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
