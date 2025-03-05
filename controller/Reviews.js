const express = require("express");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const addReview = async (req, res) => {
    try {
        const { userId, bookingId, carId, rating, comment } = req.body;

        // Validate required fields
        if (!userId || !bookingId || !carId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required." });
        }

        console.log("Received data:", req.body);

        // Ensure booking exists and belongs to the user
        const booking = await Booking.findById(bookingId).populate("user");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.user._id.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You cannot review this booking." });
        }

        // Prevent duplicate reviews
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this booking." });
        }

        // Save new review
        const review = new Review({ userId, bookingId, carId, rating, comment });
        await review.save();

        res.status(201).json({ message: "Review added successfully!", review });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};
const viewReviews=async (req, res) => {
    try {
        const reviews = await Review.find({ carId: req.body.carId }).populate("userId", "name");
        res.json(reviews);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch reviews", error });
    }
}

module.exports = { addReview,viewReviews };
