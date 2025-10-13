import express from "express";
import { createAddress, getAddressesByUser } from "../controllers/AddressController.js";

const router = express.Router();

// POST → Save address
router.post("/", createAddress);

// GET → Get all addresses by userId
router.get("/:userId", getAddressesByUser);

export default router;
