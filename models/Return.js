const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'],
    default: 'Good'
  },
  additionalCharges: {
    type: Number,
    default: 0
  },
  finalPayment: {
    type: Number,
    required: true
  },
  notes: String,
  images: [String], // Array of image paths
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Disputed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Return', ReturnSchema);