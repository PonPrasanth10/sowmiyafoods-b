import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cartRoutes from "./routes/CartRoutes.js";
import cors from "cors";
import Razorpay from "razorpay";
import productRoutes from "./routes/ProductRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js"
import WishlistRoutes from "./routes/WishlistRoutes.js"
import OrderRoutes from "./routes/OrderRoutes.js"

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ['https://www.sowmiyafoods.com/'],
    credentials: true,
  })
);
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rsfoods";

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/orders", OrderRoutes);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create Razorpay Order API
app.post("/api/payment/orders", async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order Created:", order);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// Optional: Payment verification route (later for live mode)
app.post("/api/payment/verify", async (req, res) => {
  // We'll add verification later
  res.send("Payment verified");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
