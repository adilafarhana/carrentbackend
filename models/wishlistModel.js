const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
