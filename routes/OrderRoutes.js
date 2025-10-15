import express from "express";
import { createOrder, getOrdersByUser, getAllOrders } from "../controllers/OrderController.js";

const router = express.Router();

// Save order
router.post("/", createOrder);

// Get all orders (Admin)
router.get("/admin/all", getAllOrders);

// Get orders by specific user
router.get("/:userId", getOrdersByUser);

export default router;
