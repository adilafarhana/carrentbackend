const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  rentalPricePerHour: { type: Number, default: null },
  rentalPricePerday: { type: Number, default: null },
  rentalPricePerweak: { type: Number, default: null },
  rentalPricePermonth: { type: Number, default: null },
  description: { type: String, required: true },
  type: { type: String, enum: ["Used", "Rent"], required: true },
  images: [String], // Array of image URLs
  specialOffers: { type: String, default: "" },
  discountPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ["Available", "Not Available"], default: "Available" },
  mileage: { type: Number }, // New field
  fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] }, // New field
  transmission: { type: String, enum: ["Manual", "Automatic"] }, // New field
  seatingCapacity: { type: Number, required: true },
  year: { type: Number }, // New field
  color: { type: String }, // New field
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;