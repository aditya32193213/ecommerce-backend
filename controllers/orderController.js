import mongoose from "mongoose"; // Required for Transactions
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
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

  // 1. Start a Database Session (Transaction)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Validate Stock & Deduct within the Session
    for (const item of orderItems) {
      // Pass { session } to ensure we are reading the latest data locked in this transaction
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error("Product not found"); // Triggers catch block
      }

      if (product.countInStock < item.qty) {
        throw new Error(
          `Insufficient stock for ${product.title}. Only ${product.countInStock} left.`
        );
      }

      // Deduct stock
      product.countInStock -= item.qty;
      await product.save({ session }); // Save changes within session
    }

    // 3. Create the Order
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
    });

    // Save order within the session
    const createdOrder = await order.save({ session });

    // 4. Commit Transaction (Make changes permanent)
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(createdOrder);

  } catch (error) {
    // 5. Abort Transaction (Undo EVERYTHING if any error occurs)
    await session.abortTransaction();
    session.endSession();
    
    // Pass the specific error message back to the client
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get logged in user orders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get all orders (Admin)
export const getOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// @desc    Update order to delivered
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = "Delivered";

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

// @desc    Get order by ID
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
};