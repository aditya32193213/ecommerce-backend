import Product from "../models/productModel.js";
import Favorite from "../models/favoriteModel.js";
import CartItem from "../models/cartModel.js";

// @desc    Get Dashboard Data (Optimized)
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req, res) => {
  const userId = req.user._id;

  try {
    // 🔥 OPTIMIZATION 1: Promise.all
    // Execute all DB queries at the exact same time (Parallel), not one by one.
    const [
      featuredProducts, 
      categories, 
      cartCount, 
      wishlistCount
    ] = await Promise.all([
      
      // 🔥 OPTIMIZATION 2: .lean() and .select()
      // .lean() returns plain JSON objects, skipping Mongoose overhead (saves 50% memory).
      // .select() only fetches fields we need (excludes heavy 'description' or 'images' array).
      // .limit(8) ensures we don't crash the server by loading 1000 items.
      Product.find({ rating: { $gte: 4.5 } })
             .select("title price image category rating")
             .sort({ createdAt: -1 })
             .limit(8)
             .lean(),

      // Get distinct categories
      Product.distinct("category"),

      // 🔥 OPTIMIZATION 3: countDocuments()
      // Never fetch the array if you just need the number. 
      // This is much faster than fetching items and doing .length
      CartItem.countDocuments({ user: userId }),
      Favorite.countDocuments({ user: userId })
    ]);

    // Send one clean, lightweight response
    res.status(200).json({
      success: true,
      data: {
        counts: {
          cart: cartCount,
          wishlist: wishlistCount
        },
        categories,
        featuredProducts // Only the top 8
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};