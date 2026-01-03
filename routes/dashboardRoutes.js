import express from "express";
import { protect ,admin} from "../middleware/authMiddleware.js";
import { getUserDashboard,getAdminDashboard } from "../controllers/dashboardController.js";


const router = express.Router();
router.get("/", protect, getUserDashboard);
router.get("/admin",protect, admin, getAdminDashboard)
export default router;