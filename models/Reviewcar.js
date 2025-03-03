const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    username: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now },
    car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car"
        }
  });
  
  const Review = mongoose.model("Review", reviewSchema);