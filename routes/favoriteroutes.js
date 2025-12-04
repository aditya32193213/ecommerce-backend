import express from "express";
import { addToFavorites ,getFavorites } from "../controllers/favoriteController.js";

const router= express.Router();

router.post("/", addToFavorites);
router.get("/", getFavorites);

export default router; 