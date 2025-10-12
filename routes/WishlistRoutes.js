import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/WishlistController.js";

const router = express.Router();

// 🧾 Get all wishlist items for a user
router.get("/:userId", getWishlist);

// ➕ Add product to wishlist
router.post("/:userId", addToWishlist);

// ❌ Remove product from wishlist
router.delete("/:userId/:productId", removeFromWishlist);

export default router;
