import express from "express";
import {protect, admin} from "../middleware/authMiddleware.js"
import { createOrder, getMyOrders, getOrders, updateOrderToDelivered, getOrderById } from "../controllers/orderController.js"

const router = express.Router();

// 1. Specific routes first to avoid collisions
router.get("/myorders", protect, getMyOrders);

// 2. Root route (Create Order & Admin Get All)
router.route("/").post(protect, createOrder).get(protect, admin, getOrders);

// 3. Admin: Update Status
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

router.route("/:id").get(protect, getOrderById);

export default router;