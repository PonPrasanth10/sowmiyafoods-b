import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cartRoutes from "./routes/CartRoutes.js";
import cors from "cors";
import Razorpay from "razorpay";
import productRoutes from "./routes/ProductRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import WishlistRoutes from "./routes/WishlistRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import AddressRoutes from './routes/AddressRoutes.js';
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
dotenv.config();

const allowedOrigins = [
  "https://sowmiyafoods.com",
  "https://www.sowmiyafoods.com",
  "http://localhost:5173",
  "http://localhost:5173/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

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
app.use("/api/address", AddressRoutes);

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order API
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

// ✅ Payment verification route
app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ verified: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ verified: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
