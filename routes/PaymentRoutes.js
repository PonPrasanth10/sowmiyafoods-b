// routes/paymentRoutes.js
import express from "express";
import crypto from "crypto";

const router = express.Router();

// ✅ Razorpay Payment Verification
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // ⚡ Generate signature on server
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ verified: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ verified: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ verified: false, message: "Server error" });
  }
});

export default router;
