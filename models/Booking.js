const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  type: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  place: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode:{type: String, required: true},
  date: { type: String, required: true },
  time: { type: String },
  images: [String],
  duration: { type: Number, required: false },
  totalPrice: { type: Number },
  advancePayment: { type: Number },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Processing", "Ready for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash on Delivery", "Online Payment"],
    default: "Cash on Delivery",
    required: false,
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Link to Payment
  paymentStatus: { type: String, enum: ["pending", "success"], default: "pending" }, // Payment status
  user: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }, // Link to User
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" }, // Link to Car
  startTime: { type: Date }, // Add this field for tracking the start time
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;