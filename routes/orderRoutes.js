import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  cancelOrder,
  generateInvoice,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/myorders", protect, getMyOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/cancel", protect, cancelOrder);
router.get("/:id/invoice", protect, generateInvoice); // ✅ INVOICE

export default router;
