const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true }, 
  rentalPricePerHour: { type: Number, default: null },
  description: { type: String, required: true },
  type: { type: String, enum: ["Used", "Rent"], required: true }, 
  images: [String], // Array of image URLs
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;