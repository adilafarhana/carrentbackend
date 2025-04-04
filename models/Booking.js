const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number }, // Only for rental cars
  selectedPeriod: { type: String }, // Only for rental cars
  totalPrice: { type: Number, required: true },
  advancePayment: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 }, // Add this line

  startTime: { type: Date }, // Add this line

  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Processing", "Ready for Delivery", "Delivered", "Returned", "Cancelled", "Overdue"],
    default: "Pending"
  },
  // Move return fields to top level (or keep nested but be consistent)
  returnTime: { type: Date },
  returnCondition: { 
    type: String,
    enum: ["Excellent", "Good", "Fair", "Poor", "Damaged"]
  },
  returnNotes: { type: String },
  hoursLate: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 },
  images: [{ type: String }],
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("Booking", BookingSchema);