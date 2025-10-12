import express from "express";
import {
  getProducts,
  getLatestProducts,
  getTrendingProducts,
  getProductsByCategory,
  getProductById,
  getProductsBySearch, // ✅ new
} from "../controllers/ProductController.js";

const router = express.Router();

// General product routes
router.get("/", getProducts);
router.get("/latest", getLatestProducts);
router.get("/trending", getTrendingProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search", getProductsBySearch); // ✅ search route
router.get("/:id", getProductById);

export default router;
