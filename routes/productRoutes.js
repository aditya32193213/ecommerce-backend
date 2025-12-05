/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Returns all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */

/**
 * @swagger
 * /api/products/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category to filter products
 *     responses:
 *       200:
 *         description: List of products in that category
 *       404:
 *         description: No products found for this category
 */

// src/routes/productRoutes.js
import express from "express";
import { getAllProducts, getProductsByCategory } from "../controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/", getAllProducts);

// GET products by category (electronics, fashion, etc.)
router.get("/:category", getProductsByCategory);

export default router;
