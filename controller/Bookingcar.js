const Booking = require("../models/Booking");
const mongoose = require("mongoose");

const postbooking = async (req, res) => {
    try {
        console.log("Received booking request:", req.body); 

        let { bookingDetails, car } = req.body;
        const userId = req.user.id;
        const carId = car._id;

        if (!bookingDetails) {
            bookingDetails = { fullName,email,phone,address,date, time, duration, totalPrice };
        }

        if ( !car || !bookingDetails.date || !bookingDetails.time ) {
            return res.status(400).json({ error: "Missing booking details" });
        }


        const data = {
            fullName: bookingDetails.fullName,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            address: bookingDetails.address,
            date: bookingDetails.date,
            time: bookingDetails.time,
            duration: bookingDetails.duration,
            totalPrice: bookingDetails.totalPrice,
            status: "Pending",
            user: userId,
            car: carId,
        }



        console.log(data)
     

        const newBooking = new Booking(data);

        await newBooking.save();

        res.status(201).json({ message: "Booking added successfully!", booking: newBooking });
    } catch (error) {
        console.error("Error in postbooking route:", error);
        res.status(500).json({ error: "Error saving booking", details: error.message });
    }
};

const getbooking = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user", "name email phone").populate("car", "brand model rentalPricePerHour");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
};



const Bookingdetails = async (req, res) => {
    try {
      const { id } = req.body
  
      const cars = await Booking.findOne({_id:id}).populate("car", "brand model price rentalPricePerHour ");
      res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  };



  const updateOrderStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        const booking = await Booking.findOneAndUpdate(
            { _id: id },
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Status updated successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update booking status" });
    }
};

const userBookings = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching bookings for user:", id);
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const bookings = await Booking.find({ user: id }).populate("car");

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found." });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


  
module.exports = { postbooking, getbooking ,Bookingdetails,updateOrderStatus,userBookings};
