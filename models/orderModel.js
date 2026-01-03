/**
 * Order Schema
 * Represents a complete purchase order placed by a user
 */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Ordered products snapshot
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    // Shipping address details
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Payment method used
    paymentMethod: {
      type: String,
      required: true,
    },

    // Payment gateway response
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    // Price breakdown
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    // Order status tracking
    status: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },

    // Status history for audit
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Payment & delivery flags
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
