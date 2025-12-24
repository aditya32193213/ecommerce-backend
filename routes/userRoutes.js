import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile, saveAddress } from "../controllers/userController.js";

const router = express.Router();

// Fetch and Update Profile on the same route

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/address").post(protect, saveAddress);

export default router;