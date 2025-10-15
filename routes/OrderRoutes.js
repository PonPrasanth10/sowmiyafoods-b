import express from "express";
import { createOrder, getOrdersByUser, getAllOrders, deleteOrder } from "../controllers/OrderController.js";

const router = express.Router();

// Save order
router.post("/", createOrder);

// Get all orders (Admin)
router.get("/admin/all", getAllOrders);

// Get orders by specific user
router.get("/:userId", getOrdersByUser);
router.delete("/admin/:id",deleteOrder);

export default router;
