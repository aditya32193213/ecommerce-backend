/**
 * ============================================================
 * File: couponController.js
 * ------------------------------------------------------------
 * Purpose:
 * Validates coupon codes during checkout
 *
 * NOTE:
 * Logic is intentionally simple and hardcoded
 * for demonstration / evaluation purposes
 * ============================================================
 */

export const validateCoupon = async (req, res) => {
  const { couponCode } = req.body;

  // Simple static coupon logic
  if (couponCode === "FLAT50") {
    res.json({ discount: 50, type: "flat" });
  } else if (couponCode === "WELCOME10") {
    res.json({ discount: 10, type: "percent" });
  } else {
    res.status(400);
    throw new Error("Invalid Coupon Code");
  }
};
