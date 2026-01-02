import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  generateInvoice,
  getAdminOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/myorders", protect, getMyOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);
router.get("/:id/invoice", protect, generateInvoice); // ✅ INVOICE
router.get("/admin", protect, admin, getAdminOrders);
router.put("/:id/status",protect,admin,updateOrderStatus);
export default router;
