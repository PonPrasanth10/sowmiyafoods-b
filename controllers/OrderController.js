import Order from "../models/Order.js";

// Create/save a new order after payment success
export const createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentId, orderId } = req.body;

    // Basic validation
    if (!userId || !products || !products.length || !totalAmount || !paymentId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentId,
      orderId,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
  }
};

// Get all orders for a specific user
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "UserId is required" });
    }

    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: err.message });
  }
};
