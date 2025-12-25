import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateCoupon } from "../controllers/couponController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Management and validation of discount codes
 */

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Validate coupon code
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [couponCode]
 *             properties:
 *               couponCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon valid
 *       400:
 *         description: Invalid coupon
 */
router.post("/validate", protect, validateCoupon);

export default router;
