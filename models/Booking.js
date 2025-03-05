const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, },
    totalPrice: { type: Number, },
    status: { type: String, enum: ["Pending", "Confirmed", "Delivered", "Cancelled"], default: "Pending" },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    }
    ,
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car"
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
