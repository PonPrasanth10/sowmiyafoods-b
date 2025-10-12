import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      img: String,
      price: Number,
    },
  ],
}, { timestamps: true });

export default mongoose.model("Wishlist", WishlistSchema);
