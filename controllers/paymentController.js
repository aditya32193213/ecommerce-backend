import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Process Payment
// @route   POST /api/payment/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const { items, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to process" });
    }

    // 🔒 Calculate total from DB (authoritative)
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        totalAmount += product.price * item.qty;
      }
    }

    // 🎟️ Apply coupon securely (backend only)
    if (couponCode === "FLAT50") {
      totalAmount -= 50;
    } else if (couponCode === "WELCOME10") {
      totalAmount -= totalAmount * 0.1;
    }

    if (totalAmount < 0) totalAmount = 0;

    const amountInCents = Math.round(totalAmount * 100);

    if (amountInCents < 50) {
      return res.status(400).json({ message: "Amount too low for transaction" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        userId: req.user._id.toString(),
        coupon: couponCode || "NONE",
      },
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      calculatedAmount: totalAmount,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
};

export const sendStripeApiKey = async (req, res) => {
  res.json({ stripeApiKey: process.env.STRIPE_API_KEY });
};
