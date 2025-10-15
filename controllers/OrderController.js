import Order from "../models/Order.js";
import nodemailer from "nodemailer";

// =======================
// Create/save a new order
// =======================
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      totalAmount,
      deliveryCharge,
      paymentId,
      orderId,
      address,
    } = req.body;

    // Save order in database
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      deliveryCharge,
      paymentId,
      orderId,
      address,
    });

    // ✅ Send order details to admin only
    await sendOrderEmailToAdmin({ order, address });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Get all orders for a specific user
// =======================
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Fetching orders failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

// =======================
// Send order details to admin
// =======================
export const sendOrderEmailToAdmin = async ({ order, address }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const emailHtml = `
      <h2>New Order Received!</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <h3>Delivery Address:</h3>
      <p>${address.fullName}, ${address.phone}</p>
      <p>${address.address}, ${address.city}, ${address.state} - ${address.pincode}</p>
      <h3>Products:</h3>
      <ul>
        ${order.products
          .map((p) => `<li>${p.name} x ${p.quantity} = ₹${p.subtotal}</li>`)
          .join("")}
      </ul>
    `;

    await transporter.sendMail({
      from: `"RS Foods" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // admin email from .env
      subject: `New Order Received - ${order.orderId}`,
      html: emailHtml,
    });

    console.log("Order email sent to admin successfully!");
  } catch (err) {
    console.error("Failed to send order email to admin:", err);
  }
};
// =======================
// Get all orders (Admin only)
// =======================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetching all orders failed:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};
