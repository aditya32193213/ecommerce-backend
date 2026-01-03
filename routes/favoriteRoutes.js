import express from "express";
import {
  addToFavorite,
  getFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";
import { validateFavorite } from "../middleware/validators/favoriteValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite (wishlist) APIs
 */

router.use(protect);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite products
 *     tags: [Favorites]
 */
router.get("/", getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add product to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddFavoriteInput"
 */
router.post("/", validateFavorite, addToFavorite);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: Remove product from favorites
 *     tags: [Favorites]
 */
router.delete("/:productId", removeFromFavorites);

export default router;
