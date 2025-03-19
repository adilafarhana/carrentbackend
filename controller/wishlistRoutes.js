

const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlistModel");

// Add to wishlist
const add= async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.id;

    const existingItem = await Wishlist.findOne({ userId, carId });
    if (existingItem) {
      return res.status(400).json({ message: "Car already in wishlist" });
    }

    const wishlistItem = new Wishlist({ userId, carId });
    await wishlistItem.save();
    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get user wishlist
const get=async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id }).populate("carId");
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Remove from wishlist
const remove=  async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user.id, carId: req.params.carId });
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {add,get,remove};

