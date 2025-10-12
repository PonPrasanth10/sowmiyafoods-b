import Product from "../models/Product.js";

// @desc Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProductsBySearch = async (req, res) => {
  try {
    const search = req.query.q || "";
    console.log("Search term:", search); // ✅ log the search term

    const filter = {
      $or: [
        { name: { $regex: new RegExp(search, "i") } },
        { category: { $regex: new RegExp(search, "i") } },
      ],
    };

    const products = await Product.find(filter);
    console.log("Products found:", products.length); // ✅ log number of products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductsBySearch:", error); // ✅ log full error
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


// @desc Get last 10 latest products
export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest products" });
  }
};

export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 }).limit(8);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const search = req.query.search || "";

    // If category is "All", return all products that match the search term
    const filter = category.toLowerCase() === "all"
      ? { name: { $regex: new RegExp(search, "i") } }
      : {
          category: { $regex: new RegExp(category, "i") }, // match category (case-insensitive)
          name: { $regex: new RegExp(search, "i") },       // match name (optional search)
        };

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
