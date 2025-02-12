const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  price: Number,
  description: String,
  type: String,
  images: [String],  // Array of image URLs
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
