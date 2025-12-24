// @desc    Validate Coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  const { couponCode } = req.body;

  // Simple hardcoded logic for demo
  if (couponCode === "FLAT50") {
    res.json({ discount: 50, type: "flat" }); // $50 off
  } else if (couponCode === "WELCOME10") {
    res.json({ discount: 10, type: "percent" }); // 10% off
  } else {
    res.status(400);
    throw new Error("Invalid Coupon Code");
  }
};