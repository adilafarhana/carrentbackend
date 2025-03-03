const Purchase = require("../models/Purchase");

const postPurchase = async (req, res) => {
    try {
        console.log("Received booking request:", req.body); 

        let { bookingDetails, car } = req.body;
        const userId = req.user.id;
        const carId = car._id;

        if (!bookingDetails) {
            bookingDetails = { fullName, email, phone, address};
        }

        if ( !car || !bookingDetails.fullName || !bookingDetails.email || !bookingDetails.phone ||  !bookingDetails.price) {
            return res.status(400).json({ error: "Missing booking details" });
        }


        const data = {
            fullName: bookingDetails.fullName,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            address: bookingDetails.address,
            status: "Pending",
            user: userId,
            car: carId,
        }



        console.log(data)
     

        const newBooking = new Purchase(data);

        await newBooking.save();

        res.status(201).json({ message: "Booking added successfully!", booking: newBooking });
    } catch (error) {
        console.error("Error in postbooking route:", error);
        res.status(500).json({ error: "Error saving booking", details: error.message });
    }
};

const getPurchases = async (req, res) => {
    try {
        const bookings = await Purchase.find().populate("user", "name email phone").populate("car", "brand model rentalPricePerHour");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookings", details: error.message });
    }
};

module.exports = { postPurchase, getPurchases };
