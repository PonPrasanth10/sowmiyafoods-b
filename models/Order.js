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
  deliveryCharge: { type: Number, default: 0 },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  status: { type: String, default: "paid" },
  address: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
