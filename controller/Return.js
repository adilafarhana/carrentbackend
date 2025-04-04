const Booking = require('../models/Booking');
const Car = require('../models/car');
const Return = require('../models/Return');

// In your backend routes file
const processReturn= async (req, res) => {
    try {
      const {
        bookingId,
        returnDate,
        returnTime,
        additionalCharges,
        damageDescription,
        finalAmount,
        lateReturnFee,
      } = req.body;
  
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Process image uploads
      const images = req.files.map((file) => file.path);
  
      // Update booking with return details
      booking.returnDetails = {
        returnDate,
        returnTime,
        additionalCharges: parseFloat(additionalCharges),
        damageDescription,
        finalAmount: parseFloat(finalAmount),
        lateReturnFee: parseFloat(lateReturnFee || 0),
        images,
      };
      booking.status = "Returned";
  
      // Update car availability
      const car = await Car.findById(booking.car);
      if (car) {
        car.available = true;
        await car.save();
      }
  
      await booking.save();
  
      res.status(200).json({
        message: "Car return processed successfully",
        booking,
      });
    } catch (error) {
      console.error("Error processing return:", error);
      res.status(500).json({ message: "Error processing return" });
    }
  }
const getReturnDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const returnDetails = await Return.findById(id)
      .populate('booking')
      .populate('car')
      .populate('processedBy', 'name email');

    if (!returnDetails) {
      return res.status(404).json({ message: 'Return record not found' });
    }

    res.json(returnDetails);
  } catch (error) {
    console.error('Error fetching return details:', error);
    res.status(500).json({ message: 'Server error fetching return details' });
  }
};
module.exports={getReturnDetails,processReturn}