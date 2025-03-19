const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = require('../helper/index'); 
const Payment = require("../models/Payment"); 

const postbooking = async (req, res) => {
  try {
    console.log("Received booking request:", req.body);

    // Validate if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Parse the JSON strings from req.body
    let car, bookingDetails;
    try {
      car = JSON.parse(req.body.car);
      bookingDetails = JSON.parse(req.body.bookingDetails);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(400).json({ error: "Invalid JSON data in request body" });
    }

    const userId = req.user.id; // Assuming you have user info in req.user
    const carId = car._id;

    // Validate required fields
    const requiredFields = [
      "fullName", "email", "phone", "place", "dob", "address","pincode" ,
      "date", "time", "paymentMethod"
    ];

    // Add rental-specific fields if the car type is "Rent"
    if (car.type === "Rent") {
      requiredFields.push("duration", "totalPrice", "advancePayment");
    }

    for (const field of requiredFields) {
      if (!bookingDetails[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Handle uploaded images
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Step 1: Create the booking data
    const bookingData = {
      fullName: bookingDetails.fullName,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      place: bookingDetails.place,
      dob: bookingDetails.dob,
      address: bookingDetails.address,
      pincode:bookingDetails.pincode,
      date: bookingDetails.date,
      time: bookingDetails.time,
      ...(car.type === "Rent" && { duration: bookingDetails.duration }), // Include duration only for rental cars
      ...(car.type === "Rent" && { totalPrice: bookingDetails.totalPrice }), // Include totalPrice for rental cars
      ...(car.type === "Rent" && { advancePayment: bookingDetails.advancePayment }), // Include advancePayment for rental cars
      paymentMethod: bookingDetails.paymentMethod,
      status: "Pending",
      user: userId,
      car: carId,
      type: car.type,
      images: imagePaths,
      paymentStatus: "pending",
    };

    // Save the booking to the database
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({ 
      message: "Booking added successfully!", 
      booking: newBooking, 
    });
  } catch (error) {
    console.error("Error in postbooking route:", error);
    res.status(500).json({ error: "Error saving booking", details: error.message });
  }
};
  // Example backend code (Node.js + MongoDB)
  const getbooking = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email phone address pincode place dob") // Populate user details
        .populate("car", "brand model type") // Populate car details
        .populate("payment"); // Populate payment details
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
  };
const updatePaymentStatus= async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { paymentStatus } = req.body;
  
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus },
        { new: true }
      );
  
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
  }


const Bookingdetails = async (req, res) => {
    try {
      const { id } = req.body
  
      const cars = await Booking.findOne({_id:id}).populate("car", "brand model price rentalPricePerHour type");
      res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  };



  const updateOrderStatus = async (req, res) => {
    try {
      const { id, status } = req.body;
  
      // If the status is "Delivered", set the startTime to the current time
      const updateData = { status };
      if (status === "Delivered") {
        updateData.startTime = new Date(); // Set the current time as the start time
      }
  
      // Find and update the booking
      const booking = await Booking.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true } // Return the updated document
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Return the updated booking with startTime
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
const { Types } = require("mongoose");

const savePayment = async (req, res) => {
  try {
    const { bookingId, paymentId, amount } = req.body;

    console.log("Incoming Payment Data:", { bookingId, paymentId, amount }); // Debugging

    // Validate required fields
    if (!bookingId || !paymentId || !amount) {
      return res.status(400).json({ message: "Missing payment details. Please provide bookingId, paymentId, and amount." });
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount. Amount must be a positive number." });
    }

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found. Please provide a valid bookingId." });
    }

    // Check if a payment already exists for this booking
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment) {
      return res.status(400).json({ message: "A payment already exists for this booking." });
    }

    // Create and save the payment
    const payment = new Payment({
      bookingId,
      paymentId,
      amount,
      status: "Completed",
    });

    await payment.save();

    // Update the booking with the payment reference
    booking.payment = payment._id;
    booking.paymentStatus = "success";
    await booking.save();

    console.log("Payment saved successfully:", payment); // Debugging

    res.status(201).json({ message: "Payment saved successfully", payment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Failed to save payment", error: error.message });
  }
};


const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("bookingId");
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

module.exports = { postbooking, getbooking ,Bookingdetails,updateOrderStatus,userBookings,savePayment,getPayments,updatePaymentStatus};
