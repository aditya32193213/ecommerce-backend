import Stripe from "stripe";
import dotenv from "dotenv";
import Product from "../models/productModel.js"; // Import Product model to fetch real prices

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Process Payment
// @route   POST /api/payment/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    // 1. We expect a list of items, NOT the total amount
    // structure: [{ product: "id123", qty: 2 }, ...]
    const { items } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to process" });
    }

    // 2. Calculate the Total Amount Securely
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (product) {
        // Use the Database price, not the frontend price
        totalAmount += product.price * item.qty;
      } else {
         // Optional: Handle case where product no longer exists
         // console.warn(`Product ${item.product} not found`);
      }
    }

    // 3. Convert to cents (Stripe requires integers, e.g., $10.00 -> 1000)
    // Math.round handles potential floating point errors
    const amountInCents = Math.round(totalAmount * 100);

    if (amountInCents < 50) { // Stripe minimum is usually 50 cents
         return res.status(400).json({ message: "Amount too low for transaction" });
    }

    // 4. Create the Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { 
        integration_check: "accept_a_payment",
        userId: req.user._id.toString() // Good for tracking
      },
    });

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      calculatedAmount: totalAmount // Optional: send back verified total
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send Stripe API Key
// @route   GET /api/payment/stripeapikey
// @access  Private
export const sendStripeApiKey = async (req, res) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
};