import express from "express";
import User from "../models/User.js";
import Address from "../models/Address.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login Route (using name)
router.post("/login", async (req, res) => {
  try {
    const { name, password, isAdminLogin } = req.body;

    const user = await User.findOne({ name }); // ✅ changed from email
    if (!user)
      return res.status(400).json({ message: "Invalid name or password" });

    if (isAdminLogin && !user.isAdmin)
      return res.status(403).json({ message: "Access denied. Not an admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid name or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, isAdmin: user.isAdmin },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});


// ✅ Admin-only Signup Route
router.post("/signup", protectAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, isAdmin: true },
      token,
    });
  } catch (error) {
    console.error("Admin Signup Error:", error);
    res.status(500).json({ message: "Server error during admin signup" });
  }
});

// ✅ Fetch all users with addresses (admin only)
router.get("/admin/users", protectAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const usersWithAddresses = await Promise.all(
      users.map(async (user) => {
        const addresses = await Address.find({ userId: user._id });
        return { ...user, addresses };
      })
    );

    res.status(200).json(usersWithAddresses);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// Delete a specific user (admin only)
router.delete("/admin/users/:userId", protectAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user addresses first
    await Address.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and addresses deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

// Delete a specific address (admin only)
router.delete("/admin/addresses/:addressId", protectAdmin, async (req, res) => {
  try {
    const { addressId } = req.params;

    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json({ message: "Server error deleting address" });
  }
});


export default router;
