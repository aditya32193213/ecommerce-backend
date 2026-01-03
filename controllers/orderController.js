/**
 * ============================================================
 * File: orderController.js
 * ------------------------------------------------------------
 * Purpose:
 * Handles order lifecycle management:
 * - Create order with stock deduction
 * - Cancel order with stock restoration
 * - Update order status (Admin)
 * - Generate invoice PDF
 * - Fetch user/admin orders
 *
 * Key Concepts:
 * - MongoDB transactions for stock safety
 * - Idempotency guards
 * - Strict authorization checks
 * ============================================================
 */

import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 * ------------------------------------------------------------
 * CREATE ORDER
 * ------------------------------------------------------------
 * Creates a new order and deducts stock atomically
 */
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    isPaid,
    paidAt,
    paymentResult,
    couponCode,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Start transaction to ensure stock consistency
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let subtotal = 0;

    // Validate stock & calculate subtotal
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (!product || product.countInStock < item.qty) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      subtotal += product.price * item.qty;
      product.countInStock -= item.qty;
      await product.save({ session });
    }

    // Apply coupon logic
    let discount = 0;
    if (couponCode === "FLAT50") discount = 50;
    else if (couponCode === "WELCOME10") discount = subtotal * 0.1;

    let totalPrice = Math.max(subtotal - discount, 0);

    // Create order document
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
      couponCode: couponCode || null,
      isPaid: isPaid || false,
      paidAt: paidAt || null,
      paymentResult: paymentResult || {},
      status: "Placed",
      statusHistory: [{ status: "Placed", date: new Date() }],
    });

    const createdOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * ------------------------------------------------------------
 * GET USER ORDERS
 * ------------------------------------------------------------
 * Fetches orders for the logged-in user
 */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

/**
 * ------------------------------------------------------------
 * GET ORDER BY ID
 * ------------------------------------------------------------
 * Fetches a single order with user info
 */
export const getOrderById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

/**
 * ------------------------------------------------------------
 * UPDATE ORDER STATUS (ADMIN)
 * ------------------------------------------------------------
 * Advances order through predefined lifecycle
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    const nextStatusMap = {
      Placed: "Processing",
      Processing: "Shipped",
      Shipped: "Delivered",
    };

    const nextStatus = nextStatusMap[order.status];
    if (!nextStatus) {
      return res.status(400).json({ message: "Order cannot be updated further" });
    }

    order.status = nextStatus;
    order.statusHistory.push({ status: nextStatus, date: new Date() });

    if (nextStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * ------------------------------------------------------------
 * CANCEL ORDER
 * ------------------------------------------------------------
 * Cancels order and restores stock
 */
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found");

  if (order.status === "Cancelled") return res.json(order);
  if (order.isDelivered) throw new Error("Delivered orders cannot be cancelled");

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.status = "Cancelled";
  order.statusHistory.push({ status: "Cancelled", date: new Date() });

  await order.save();
  res.json(order);
};

/**
 * ------------------------------------------------------------
 * ADMIN ORDERS (PAGINATED)
 * ------------------------------------------------------------
 */
export const getAdminOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let userFilter = {};

    if (req.query.keyword) {
      const users = await User.find({
        name: { $regex: req.query.keyword, $options: "i" },
      }).select("_id");

      userFilter = { user: { $in: users.map((u) => u._id) } };
    }

    const [count, orders] = await Promise.all([
      Order.countDocuments(userFilter),
      Order.find(userFilter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .lean(),
    ]);

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
};

/**
 * ------------------------------------------------------------
 * GENERATE INVOICE (PDF)
 * ------------------------------------------------------------
 * Generates downloadable invoice for order
 */
export const generateInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Allow order owner or admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
  doc.text(`Order Status: ${order.status}`);
  doc.moveDown();

  doc.fontSize(14).text("Customer Details", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Name: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.moveDown();

  doc.fontSize(14).text("Shipping Address", { underline: true });
  doc.moveDown(0.5);
  const addr = order.shippingAddress;
  doc.fontSize(12).text(addr.address);
  doc.text(`${addr.city}, ${addr.postalCode}`);
  doc.text(addr.country || "India");
  doc.moveDown();

  doc.fontSize(14).text("Order Items", { underline: true });
  doc.moveDown(0.5);
  order.orderItems.forEach((item) => {
    doc.fontSize(12).text(`${item.name} x${item.qty} - $${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: $${order.totalPrice}`, {
    align: "right",
  });

  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for shopping with Shopnetic!", {
    align: "center",
  });

  doc.end();
};
