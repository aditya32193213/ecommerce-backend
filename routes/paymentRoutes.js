import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { processPayment, sendStripeApiKey } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/process").post(protect, processPayment);
router.route("/stripeapikey").get(protect, sendStripeApiKey);

export default router;