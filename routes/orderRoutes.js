import express from "express";
import {protect} from "../middleware/authMiddleware.js"
import { createOrder, getMyOrders } from "../controllers/orderController.js"

const router = express.Router();

// Use 'protect' to ensure only logged-in users can access these routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

export default router;