/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite products APIs
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorite items
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: List of favorite items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Favorite"
 */

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a product to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AddFavoriteInput"
 *     responses:
 *       201:
 *         description: Product added to favorites
 *       400:
 *         description: Invalid productId format
 *       404:
 *         description: Product not found
 */

// src/routes/favoriteroutes.js
import express from "express";
import { addToFavorite,getFavorites,removeFromFavorites } from "../controllers/favoriteController.js";
import { validateFavorite } from "../middleware/validators/favoriteValidator.js";

const router = express.Router();

// Add to favorites
router.post("/", validateFavorite, addToFavorite);

// Get all favorites
router.get("/", getFavorites);

// Delete favorite
router.delete("/:productId", removeFromFavorites);

export default router;
