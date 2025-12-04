import express from "express";
import {getAllProducts, getProductsbyCategory} from "../controllers/productController.js";
 
const router = express.Router();

router.get("/",getAllProducts);
router.get("/:category",getProductsbyCategory);

export default router;