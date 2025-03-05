const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
        carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
