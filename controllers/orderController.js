import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    paymentResult,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Deduct stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (!product || product.countInStock < item.qty) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      product.countInStock -= item.qty;
      await product.save({ session });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: isPaid || false,
      paidAt: paidAt || null,
      paymentResult: paymentResult || {},
      statusHistory: [{ status: "Processing" }], // ✅ INIT TIMELINE
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

// ================= GET MY ORDERS =================
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// ================= GET ORDER BY ID =================
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) throw new Error("Order not found");
  res.json(order);
};

// ================= MARK DELIVERED =================
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found");

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = "Delivered";
  order.statusHistory.push({ status: "Delivered" });

  await order.save();
  res.json(order);
};

// ================= CANCEL ORDER + RESTORE STOCK =================
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found");
  if (order.isDelivered) throw new Error("Delivered orders cannot be cancelled");

  // 🔥 RESTORE STOCK
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.status = "Cancelled";
  order.statusHistory.push({ status: "Cancelled" });

  await order.save();
  res.json(order);
};

// ================= INVOICE PDF =================
export const generateInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user");
  if (!order) throw new Error("Order not found");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Payment: ${order.paymentMethod}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  order.orderItems.forEach((item) => {
    doc.text(`${item.name} x${item.qty} - $${item.price}`);
  });

  doc.moveDown();
  doc.text(`Total: $${order.totalPrice}`, { bold: true });

  doc.end();
};
