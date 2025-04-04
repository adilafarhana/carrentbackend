const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ["Rent", "Used"], required: true },
  status: { 
    type: String, 
    enum: ["Available", "Not Available", "Maintenance"],
    default: "Available"
  },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  seatingCapacity: { type: Number, required: true },
  rentalPricePerHour: { type: Number },
  rentalPricePerday: { type: Number },
  rentalPricePerweak: { type: Number },
  rentalPricePermonth: { type: Number },
  price: { type: Number }, // For used cars
  description: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Car", CarSchema);