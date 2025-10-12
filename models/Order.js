import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String },
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      subtotal: { type: Number },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  status: { type: String, default: "paid" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
