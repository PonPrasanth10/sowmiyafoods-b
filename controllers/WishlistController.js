import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// 🧾 Get Wishlist for a User
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    res.status(200).json(wishlist || { userId: req.params.userId, products: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// ➕ Add Product to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // 🧠 Fetch product details from DB
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId: req.params.userId });

    if (wishlist) {
      const alreadyExists = wishlist.products.some(
        (p) => p.productId.toString() === productId
      );

      if (alreadyExists)
        return res.status(400).json({ message: "Product already in wishlist" });

      wishlist.products.push({
        productId: product._id,
        name: product.name,
        img: product.image,
        price: product.price,
      });
      await wishlist.save();
    } else {
      wishlist = await Wishlist.create({
        userId: req.params.userId,
        products: [
          {
            productId: product._id,
            name: product.name,
            img: product.image,
            price: product.price,
          },
        ],
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// ❌ Remove Product from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};
