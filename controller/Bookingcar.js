const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = require('../helper/index'); 
const Payment = require("../models/Payment"); 
const Car=require("../models/car")

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

    const userId = req.user.id;
    const carId = car._id;

    // Validate required fields
    const requiredFields = [
      "fullName", "email", "phone", "place", "dob", "address","pincode",
      "date", "time", "paymentMethod"
    ];

    // Add rental-specific fields if the car type is "Rent"
    if (car.type === "Rent") {
      requiredFields.push("duration", "totalPrice", "advancePayment","balanceAmount","selectedPeriod");
    }

    for (const field of requiredFields) {
      if (!bookingDetails[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Handle uploaded images
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Calculate balance due if not provided
    const balanceDue = bookingDetails.balanceAmount || 
                      (bookingDetails.totalPrice - (bookingDetails.advancePayment || 0));

    // Create the booking data
    const bookingData = {
      fullName: bookingDetails.fullName,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      place: bookingDetails.place,
      dob: bookingDetails.dob,
      address: bookingDetails.address,
      pincode: bookingDetails.pincode,
      date: bookingDetails.date,
      time: bookingDetails.time,
      ...(car.type === "Rent" && { 
        duration: bookingDetails.duration,
        selectedPeriod: bookingDetails.selectedPeriod
      }),
      totalPrice: bookingDetails.totalPrice,
      advancePayment: bookingDetails.advancePayment || 0,
      balanceAmount: bookingDetails.balanceAmount || balanceDue,
      balanceDue: balanceDue, // Add this line
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
  const getBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({})
        .populate({
          path: "car",
          select: "brand model type images status"
        })
        .populate({
          path: "user",
          select: "name email phone"
        })
        .sort({ date: -1 });
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found" });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
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
 // Update your existing updateOrderStatus endpoint
// bookingController.js

const calculatePenalty = (returnTime) => {
  try {
    if (!booking || !returnTime) return {
      isLate: false,
      hoursLate: 0,
      penaltyAmount: 0,
      minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0
    };

    const expectedReturn = calculateExpectedReturn();
    if (!expectedReturn) return {
      isLate: false,
      hoursLate: 0,
      penaltyAmount: 0,
      minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0
    };
    
    const actualReturn = new Date(returnTime);
    
    // Calculate hours late (round up to nearest hour)
    const hoursLate = Math.max(0, Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60)));
    
    // Only calculate penalty if actually late
    if (hoursLate <= 0) {
      return {
        isLate: false,
        hoursLate: 0,
        penaltyAmount: 0,
        minimumPenalty: (booking.totalPrice - (booking.advancePayment || 0)) * 0.2
      };
    }

    // Calculate remaining balance (total - advance payment)
    const remainingBalance = booking.totalPrice - (booking.advancePayment || 0);

    // Calculate hourly rate based on booking period
    let hourlyRate;
    switch(booking.selectedPeriod) {
      case "rentalPricePerHour":
        hourlyRate = booking.totalPrice / booking.duration;
        break;
      case "rentalPricePerday":
        hourlyRate = booking.totalPrice / (booking.duration * 24);
        break;
      case "rentalPricePerweak":
        hourlyRate = booking.totalPrice / (booking.duration * 24 * 7);
        break;
      case "rentalPricePermonth":
        hourlyRate = booking.totalPrice / (booking.duration * 24 * 30);
        break;
      default:
        hourlyRate = booking.totalPrice / (booking.duration * 24);
    }

    // Calculate penalty (1.5x hourly rate per hour late, minimum 20% of remaining balance)
    const calculatedPenalty = Math.max(
      remainingBalance * 0.2, // Minimum 20% of remaining balance
      hourlyRate * 1.5 * hoursLate // 1.5x hourly rate for each late hour
    );

    // Cap penalty at remaining balance (100%)
    const finalPenalty = Math.min(calculatedPenalty, remainingBalance);

    return {
      isLate: true,
      hoursLate: hoursLate,
      penaltyAmount: Math.round(finalPenalty * 100) / 100,
      minimumPenalty: Math.round(remainingBalance * 0.2 * 100) / 100,
      expectedReturn: expectedReturn.toISOString()
    };
  } catch (error) {
    console.error("Penalty calculation error:", error);
    return {
      isLate: false,
      hoursLate: 0,
      penaltyAmount: 0,
      minimumPenalty: (booking?.totalPrice - (booking?.advancePayment || 0)) * 0.2 || 0,
      expectedReturn: null
    };
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id, status, returnCondition, returnNotes, returnTime, penaltyAmount = 0 } = req.body;

    // Validate request
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing booking ID or status'
      });
    }

    // Find booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Handle delivery status - set start time
    if (status === 'Delivered' && booking.status !== 'Delivered') {
      updateData.startTime = new Date();
      
      // Update car status to "Rented"
      await Car.findByIdAndUpdate(booking.car, { 
        status: 'Rented',
        available: false 
      });
    }

    // Handle return status
    if (status === 'Returned') {
      if (!returnCondition || !returnTime) {
        return res.status(400).json({
          success: false,
          message: 'Return condition and time are required'
        });
      }

      // Calculate hours late
      const expectedReturn = new Date(booking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
      const actualReturn = new Date(returnTime);
      const hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));

      // Set return fields
      updateData.returnTime = actualReturn;
      updateData.returnCondition = returnCondition;
      updateData.returnNotes = returnNotes || '';
      updateData.lateFee = penaltyAmount;
      updateData.hoursLate = hoursLate;

      // Update car status back to available
      await Car.findByIdAndUpdate(booking.car, { 
        status: 'Available',
        available: true 
      });
    }

    // Perform the update
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    .populate('car', 'brand model')
    .populate('user', 'name email');

    if (!updatedBooking) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update booking'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};





// Helper function
function calculateHoursLate(bookingDate, duration, returnTime) {
  const expectedReturn = new Date(bookingDate);
  expectedReturn.setHours(expectedReturn.getHours() + (duration || 24));
  const actualReturn = new Date(returnTime);
  return Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
}
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





const returnCar = async (req, res) => {
  try {
    const { bookingId, returnCondition, returnNotes, returnTime } = req.body;
    
    const booking = await Booking.findById(bookingId)
      .populate('car')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Calculate expected return time
    const expectedReturn = new Date(booking.date);
    const duration = booking.duration || 24; // Default to 24 hours if not set
    expectedReturn.setHours(expectedReturn.getHours() + duration);

    // Use provided return time or current time if not specified
    const actualReturnTime = returnTime ? new Date(returnTime) : new Date();
    
    // Calculate penalty with standardized rates
    const latePenalty = calculateLatePenalty(
      actualReturnTime,
      expectedReturn,
      booking.totalPrice
    );

    // Update booking with return details
    booking.returnTime = actualReturnTime;
    booking.returnCondition = returnCondition;
    booking.returnNotes = returnNotes;
    booking.latePenalty = latePenalty;
    booking.finalCharges = booking.totalPrice + latePenalty;
    booking.balanceDue = booking.finalCharges - (booking.advancePayment || 0);
    booking.status = "Returned";
    
    await booking.save();

    // Update car status to available
    await Car.findByIdAndUpdate(booking.car._id, { status: "Available" });

    res.status(200).json({
      success: true,
      message: latePenalty > 0 
        ? `Late return penalty applied: ₹${latePenalty} (Minimum ${Math.round((MINIMUM_PENALTY / booking.totalPrice) * 100)}% of base amount)`
        : "Car returned on time",
      booking,
      latePenalty,
      balanceDue: booking.balanceDue,
      penaltyDetails: {
        rate: "15% per hour",
        minimum: "20% of base amount",
        maximum: "100% of base amount"
      }
    });

  } catch (error) {
    console.error("Error returning car:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process car return" 
    });
  }
};

const checkOverdueBookings = async () => {
  try {
    const overdueBookings = await Booking.find({
      status: "Delivered",
      startTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // More than 24 hours old
    }).populate("user car");
    
    for (const booking of overdueBookings) {
      // Calculate late fee
      const hoursLate = Math.ceil((Date.now() - booking.startTime) / (1000 * 60 * 60)) - 24;
      const lateFee = hoursLate * (booking.totalPrice / 24) * 1.5; // 1.5x hourly rate for late returns
      
      // Update booking with late fee
      booking.lateReturnFee = lateFee;
      booking.finalCharges = booking.totalPrice + lateFee;
      booking.balanceDue = booking.finalCharges - (booking.advancePayment || 0);
      booking.status = "Overdue";
      
      await booking.save();
      
      // Here you would typically send notifications to the user
      console.log(`Overdue booking: ${booking._id} for user ${booking.user.email}`);
      console.log(`Late fee applied: ₹${lateFee}`);
    }
    
    return overdueBookings;
  } catch (error) {
    console.error("Error checking overdue bookings:", error);
    return [];
  }
};









const processReturn = async (req, res) => {
  try {
    const {
      bookingId,
      returnCondition,
      returnNotes,
      returnTime,
      lateFee = 0,
      finalCharges,
      balanceDue
    } = req.body;

    // Validate required fields
    if (!bookingId || !returnCondition || !returnTime) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (bookingId, returnCondition, returnTime)"
      });
    }

    // Find and populate booking
    const booking = await Booking.findById(bookingId)
      .populate('car')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        error: "Booking not found" 
      });
    }

    // Update booking with return details
    booking.returnTime = new Date(returnTime);
    booking.returnCondition = returnCondition;
    booking.returnNotes = returnNotes || "";
    booking.lateFee = lateFee;
    booking.finalCharges = finalCharges || (booking.totalPrice + lateFee);
    booking.balanceDue = balanceDue || (booking.finalCharges - (booking.advancePayment || 0));
    booking.status = "Returned";
    booking.returnStatus = "Returned";

    // Update car availability
    if (booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { 
        status: "Available",
        available: true 
      });
    }

    // Save updated booking
    const updatedBooking = await booking.save();

    // Return success response with complete booking data
    res.status(200).json({
      success: true,
      message: "Car returned successfully",
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Return processing error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to process return" 
    });
  }
};

const getUserBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'brand model type price rentalPricePerHour')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify the booking belongs to the requesting user
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this booking"
      });
    }

    if (booking.status === "Returned") {
      if (booking.returnTime) {
        const expectedReturn = new Date(booking.date);
        expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
        const actualReturn = new Date(booking.returnTime);
        booking.hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getUserBookingDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching booking details"
    });
  }
};


const payPenalty = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, amount } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID"
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment amount"
      });
    }

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }

    if (booking.balanceDue <= 0) {
      return res.status(400).json({
        success: false,
        error: "No balance due for this booking"
      });
    }

    if (amount > booking.balanceDue) {
      return res.status(400).json({
        success: false,
        error: "Payment amount exceeds balance due"
      });
    }

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      user: booking.user,
      amount: amount,
      paymentType: "Penalty",
      status: "Completed"
    });
    await payment.save({ session });

    // Update booking
    booking.paymentHistory.push({
      amount: amount,
      paymentDate: new Date(),
      paymentMethod: "Online",
      transactionId: payment._id
    });
    booking.balanceDue -= amount;
    
    if (booking.balanceDue <= 0) {
      booking.paymentStatus = "Paid";
    }

    await booking.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: {
        paymentId: payment._id,
        amountPaid: amount,
        balanceDue: booking.balanceDue
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process payment"
    });
  } finally {
    session.endSession();
  }
};

// Get booking details (including status)



// Get return details for a specific booking
const bookingReturns= async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'brand model')
      .populate('user', 'name email');

    if (!booking || booking.status !== "Returned") {
      return res.status(404).json({
        error: "Return details not found"
      });
    }

    // Calculate hours late if not already set
    if (booking.returnTime) {
      const expectedReturn = new Date(booking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
      const actualReturn = new Date(booking.returnTime);
      booking.hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ 
      error: "Server error" 
    });
  }
}


// Get return details for a booking
const getUserReturnDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'brand model type price rentalPricePerHour')
      .populate('user', 'name email phone')
      .populate('payments');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify the booking belongs to the requesting user
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this booking"
      });
    }

    if (booking.status !== "Returned") {
      return res.status(400).json({
        success: false,
        message: "This booking hasn't been returned yet"
      });
    }

    if (booking.returnTime) {
      const expectedReturn = new Date(booking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
      const actualReturn = new Date(booking.returnTime);
      booking.hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getUserReturnDetails:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching return details"
    });
  }
};

// controllers/bookingController.js
// controllers/bookingController.js
const getCarBookingHistory = async (req, res) => {
  try {
    const { carId } = req.params;

    // Validate car ID
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ error: "Invalid Car ID" });
    }

    // Get car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Get bookings for this car
    const bookings = await Booking.find({ car: carId })
      .populate('user', 'name email phone')
      .sort({ date: -1 });

    // Calculate statistics
    const stats = {
      totalRentals: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      activeBookings: bookings.filter(b => 
        ["Confirmed", "Processing", "Ready for Delivery", "Delivered"].includes(b.status)
        .length
    )};

    res.status(200).json({ car, bookings, statistics: stats });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error fetching booking history" });
  }
};




const getBookingReturns = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'brand model type price rentalPricePerHour')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found"
      });
    }

    // Calculate hours late if returned
    let hoursLate = 0;
    if (booking.status === "Returned" && booking.returnTime) {
      const expectedReturn = new Date(booking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
      const actualReturn = new Date(booking.returnTime);
      hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
    }

    res.status(200).json({
      success: true,
      data: {
        ...booking.toObject(),
        hoursLate: hoursLate.toFixed(1)
      }
    });
  } catch (error) {
    console.error("Error fetching return details:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch return details"
    });
  }
};




// bookingController.js
// Get all bookings for a specific car
const getCarBookings = async (req, res) => {
  try {
    const { carId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }

    const bookings = await Booking.find({ car: carId })
      .populate({
        path: "user",
        select: "name email phone"
      })
      .sort({ date: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this car" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching car bookings:", error);
    res.status(500).json({ message: "Failed to fetch car bookings" });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};

// Get single booking details (for user)
const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assuming user ID is available from auth middleware

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid booking ID",
        data: null
      });
    }

    // Find the booking and verify it belongs to the requesting user
    const booking = await Booking.findOne({
      _id: id,
      user: userId
    })
    .populate('car', 'brand model type price rentalPricePerHour images')
    .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found or not authorized",
        data: null
      });
    }

    // Prepare response data with all necessary fields
    const responseData = {
      _id: booking._id,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      address: booking.address,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      totalPrice: booking.totalPrice,
      advancePayment: booking.advancePayment,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      car: booking.car,
      user: booking.user,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Return details if available
      returnTime: booking.returnTime,
      returnCondition: booking.returnCondition,
      returnNotes: booking.returnNotes,
      hoursLate: booking.hoursLate,
      lateFee: booking.lateFee
    };

    return res.status(200).json({
      status: "success",
      message: "Booking details retrieved successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
      error: error.message
    });
  }
};

// Get booking details (add to your backend routes)
// Add this route to your existing bookingRoutes.js
const bookings= async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'brand model year color fuelType transmission seatingCapacity mileage images type')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
}
const userBookings = async (req, res) => {
};
// Add to exports


// Add this to your bookingController.js
const getReturnDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }

    // Find booking with return details
    const booking = await Booking.findById(id)
      .populate('car', 'brand model year color fuelType transmission seatingCapacity mileage images type')
      .populate('user', 'name email phone')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Calculate hours late if returned
    if (booking.status === "Returned" && booking.returnTime) {
      const expectedReturn = new Date(booking.date);
      expectedReturn.setHours(expectedReturn.getHours() + (booking.duration || 24));
      const actualReturn = new Date(booking.returnTime);
      booking.hoursLate = Math.max(0, (actualReturn - expectedReturn) / (1000 * 60 * 60));
    }

    // Calculate balance due
    booking.balanceDue = (booking.totalPrice || 0) - (booking.advancePayment || 0) + (booking.lateFee || 0);

    res.status(200).json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error("Error fetching return details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch return details",
      error: error.message
    });
  }
};

module.exports = {
  getBookingDetails,
  getCars,
  getCarBookings, 
  getCarBookingHistory,
  getBookingReturns,
  checkOverdueBookings,
  getUserBookingDetails, 
  bookingReturns,
  payPenalty,
  processReturn,
  returnCar,
  getUserReturnDetails,
  postbooking, 
  getBookings,
  Bookingdetails, // Consider renaming to getBookingDetails
  updateOrderStatus,
  savePayment,
  getPayments,
  updatePaymentStatus ,
  bookings  ,
  userBookings,
  getReturnDetails
};