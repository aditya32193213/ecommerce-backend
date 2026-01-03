/**
 * ============================================================
 * File: paymentController.js
 * ------------------------------------------------------------
 * Purpose:
 * Handles Stripe payment processing securely.
 *
 * Security Principles:
 * - Amount calculated on backend only
 * - Product prices fetched from DB
 * - Coupon logic enforced server-side
 * ============================================================
 */

import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ------------------------------------------------------------
 * PROCESS PAYMENT
 * ------------------------------------------------------------
 * Creates Stripe PaymentIntent after validating order & items
 */
export const processPayment = async (req, res) => {
  try {
    const { items, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to process" });
    }

    // Prevent payment for cancelled orders
    if (req.body.orderId) {
      const order = await Order.findById(req.body.orderId);
      if (order && order.status === "Cancelled") {
        return res.status(400).json({
          message: "Cannot process payment for cancelled order",
        });
      }
    }

    // Calculate authoritative total from DB
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) totalAmount += product.price * item.qty;
    }

    // Apply coupon
    if (couponCode === "FLAT50") totalAmount -= 50;
    else if (couponCode === "WELCOME10")
      totalAmount -= totalAmount * 0.1;

    totalAmount = Math.max(totalAmount, 0);
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
  } catch {
    res.status(500).json({ message: "Payment processing failed" });
  }
};

/**
 * ------------------------------------------------------------
 * SEND STRIPE PUBLIC KEY
 * ------------------------------------------------------------
 */
export const sendStripeApiKey = async (req, res) => {
  res.json({ stripeApiKey: process.env.STRIPE_API_KEY });
};
