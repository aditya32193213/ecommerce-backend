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
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/address", protect, saveAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);
router.get("/meta", protect, getUserMeta);
router.get("/admin", protect, admin, getAdminUsers);
router.put("/:id/toggle-admin", protect, admin, toggleAdminRole);
router.delete("/:id", protect, admin, deleteUser);

export default router;
