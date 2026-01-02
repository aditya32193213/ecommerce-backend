import Product from "../models/productModel.js";
import Favorite from "../models/favoriteModel.js";
import CartItem from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// ================= USER DASHBOARD =================
export const getUserDashboard = async (req, res) => {
  const userId = req.user._id;

  try {
    const [
      featuredProducts,
      categories,
      cartCount,
      wishlistCount,
    ] = await Promise.all([
      Product.find({ rating: { $gte: 4.5 } })
        .select("title price image category rating")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),

      Product.distinct("category"),

      CartItem.countDocuments({ user: userId }),
      Favorite.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          cart: cartCount,
          wishlist: wishlistCount,
        },
        categories,
        featuredProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= ADMIN DASHBOARD =================
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueAgg,
      ordersByDate,
      ordersByStatus,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),

      // ✅ TOTAL REVENUE (paid + not cancelled)
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]),

      // ✅ ORDERS BY DATE (MATCHES REVENUE LOGIC)
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // ✅ ORDERS BY STATUS (includes Cancelled for analytics)
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      ordersByDate,
      ordersByStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch admin stats",
    });
  }
};
