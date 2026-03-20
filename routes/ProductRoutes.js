import express from "express";
import {
  getProducts,
  getLatestProducts,
  getTrendingProducts,
  getProductsByCategory,
  getProductById,
  getProductsBySearch, // ✅ new
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// General product routes
router.get("/", getProducts);
router.get("/latest", getLatestProducts);
router.get("/trending", getTrendingProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search", getProductsBySearch); // ✅ search route
router.get("/:id", getProductById);

// Admin-only CRUD routes
router.post("/admin/create", protectAdmin, createProduct);
router.put("/admin/:id", protectAdmin, updateProduct);
router.delete("/admin/:id", protectAdmin, deleteProduct);

export default router;
