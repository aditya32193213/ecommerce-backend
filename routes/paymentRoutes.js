import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  processPayment,
  sendStripeApiKey,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment integration and keys
 */

/**
 * @swagger
 * /api/payment/process:
 *   post:
 *     summary: Process Stripe payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product, qty]
 *                   properties:
 *                     product:
 *                       type: string
 *                     qty:
 *                       type: number
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid payment data
 */
router.post("/process", protect, processPayment);

/**
 * @swagger
 * /api/payment/stripeapikey:
 *   get:
 *     summary: Get Stripe public API key
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stripe API key returned
 */
router.get("/stripeapikey", protect, sendStripeApiKey);

export default router;
