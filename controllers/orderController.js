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
    taxPrice,
    shippingPrice,
    isPaid,
    paidAt,
    paymentResult,
    couponCode, // ✅ NEW (optional)
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ================= RECALCULATE PRICES (AUTHORITATIVE) =================
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);

      if (!product || product.countInStock < item.qty) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      subtotal += product.price * item.qty;

      // 🔥 Deduct stock (existing logic preserved)
      product.countInStock -= item.qty;
      await product.save({ session });
    }

    // ================= APPLY COUPON (SAFE) =================
    let discount = 0;

    if (couponCode === "FLAT50") {
      discount = 50;
    } else if (couponCode === "WELCOME10") {
      discount = subtotal * 0.1;
    }

    let totalPrice = subtotal - discount;
    if (totalPrice < 0) totalPrice = 0;

    // ================= CREATE ORDER =================
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,

      // 🔐 Backend-trusted prices
      itemsPrice: subtotal,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,

      couponCode: couponCode || null,

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
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
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
  doc.fontSize(12).text(`Name: ${order.user.name || "N/A"}`);
  doc.text(`Email: ${order.user.email || "N/A"}`);
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
    doc.fontSize(12).text(`${item.name}  x${item.qty}  -  $${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: $${order.totalPrice}`, {
    align: "right",
  });

  doc.moveDown(2);
  doc.fontSize(10).text(
    "Thank you for shopping with Shopnetic!",
    { align: "center" }
  );

  doc.end();
};
