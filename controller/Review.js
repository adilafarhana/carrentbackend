const submitreview= async (req, res) => {
    try {
        const { bookingId, review, imageUrl } = req.body;
        const userId = req.user.id;

        const booking = await Booking.findById(bookingId).populate("car");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const newReview = new Review({
            userId,
            carId: booking.car._id,
            bookingId,
            review,
            imageUrl
        });
        
        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully", review: newReview });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Server error" });
    }
}
module.export={submitreview} 