// controllers/AddressController.js
import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  try {
    const { userId, fullName, phone, address, city, state, pincode } = req.body;

    if (!userId || !fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = new Address({
      userId,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Error saving address:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
