import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product browsing and management APIs
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", protect, admin, createProduct);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get all unique product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/categories", getAllCategories);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products filtered by category
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
