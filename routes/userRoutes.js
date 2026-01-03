import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  saveAddress,
  updateAddress,
  deleteAddress,
  getUserMeta,
  getAdminUsers,
  toggleAdminRole,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile, address management, and admin operations
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", protect, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", protect, updateUserProfile);

/**
 * @swagger
 * /api/users/address:
 *   post:
 *     summary: Save a new address for user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Address"
 *     responses:
 *       201:
 *         description: Address saved successfully
 */
router.post("/address", protect, saveAddress);

/**
 * @swagger
 * /api/users/address/{addressId}:
 *   put:
 *     summary: Update an existing address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put("/address/:addressId", protect, updateAddress);

/**
 * @swagger
 * /api/users/address/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete("/address/:addressId", protect, deleteAddress);

/**
 * @swagger
 * /api/users/meta:
 *   get:
 *     summary: Get user meta data (cart count, favorites count)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User meta data
 */
router.get("/meta", protect, getUserMeta);

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get("/admin", protect, admin, getAdminUsers);

/**
 * @swagger
 * /api/users/{id}/toggle-admin:
 *   put:
 *     summary: Toggle admin role for a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User role updated
 */
router.put("/:id/toggle-admin", protect, admin, toggleAdminRole);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:id", protect, admin, deleteUser);

export default router;
