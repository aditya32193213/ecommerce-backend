/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CartItem"
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add an item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddCartInput"
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid productId
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart item
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Cart item not found
 */


import express from "express";
import { 
  addToCart, 
  getCartItems, 
  removeCartItem, 
  updateCartItem 
} from "../controllers/cartController.js";
import { validateAddToCart } from "../middleware/validators/cartValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Add item to cart
router.post("/", validateAddToCart, addToCart);

// Get all cart items
router.get("/", getCartItems);

// Remove an item from cart (Updated to use productId)
router.delete("/:productId", removeCartItem);

// Update item quantity in cart
router.put("/:id", updateCartItem);

export default router;