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
import express from "express";
// 1. IMPORT MIDDLEWARE (Fixing the missing import error)
import { protect, admin } from "../middleware/authMiddleware.js"; 
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @route   POST /api/products
 * @desc    Create a product (Admin only)
 */
router.route("/")
  .get(getAllProducts)
  .post(protect, admin, createProduct); // <--- FIXED: Added Create Route

/**
 * @route   GET /api/products/categories
 * @desc    Get all unique categories
 */
router.get("/categories", getAllCategories);


/**
 * @route   GET /api/products/:category
 * @desc    Get products by category
 * @note    We place this specific GET route before the generic /:id route 
 * to avoid ID collisions if needed, though usually IDs are unique.
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @route   GET / DELETE / PUT /api/products/:id
 * @desc    Admin operations (Delete, Update)
 */
router
  .route("/:id")
  .get(getProductById) // Optional: Standard REST fetch
  .delete(protect, admin, deleteProduct) // Admin delete
  .put(protect, admin, updateProduct);   // Admin update


export default router;