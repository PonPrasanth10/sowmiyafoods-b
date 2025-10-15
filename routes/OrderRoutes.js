import express from "express";
import { createOrder, getOrdersByUser } from "../controllers/OrderController.js";

const router = express.Router();

// Save order after successful payment
router.post("/", createOrder);

// Get all orders of a specific user
router.get("/:userId", getOrdersByUser);

export default router;