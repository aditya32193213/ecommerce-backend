import express from "express";
import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
  clearUserCart,
} from "../controllers/cartController.js";
import { validateAddToCart } from "../middleware/validators/cartValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart APIs
 */

router.use(protect);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get logged-in user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", getCartItems);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddCartInput"
 */
router.post("/", validateAddToCart, addToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 */
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 */
router.delete("/", clearUserCart);

export default router;
