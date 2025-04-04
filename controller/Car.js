const Car = require('../models/car');
const upload = require('../helper/index');
const Notification = require("../models/Notification");

const uploadcar = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const {
      brand,
      model,
      price,
      description,
      type,
      rentalPricePerHour,
      rentalPricePerday,
      rentalPricePerweak,
      rentalPricePermonth,
      specialOffers,
      discountPercentage,
      mileage,
      fuelType,
      transmission,
      seatingCapacity,
      year,
      color,
    } = req.body;

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const newCar = new Car({
      brand,
      model,
      price,
      description,
      type,
      images: imagePaths,
      rentalPricePerHour: type === "Rent" ? rentalPricePerHour : undefined,
      rentalPricePerday: type === "Rent" ? rentalPricePerday : undefined,
      rentalPricePerweak: type === "Rent" ? rentalPricePerweak : undefined,
      rentalPricePermonth: type === "Rent" ? rentalPricePermonth : undefined,
      specialOffers,
      discountPercentage: discountPercentage || 0,
      status: "Available",
      mileage, // New field
      fuelType, // New field
      transmission,
      seatingCapacity, // New field
      year, // New field
      color, // New field
    });

    await newCar.save();

    const notification = new Notification({
      message: `New car uploaded: ${brand} ${model} for ${type === "Rent" ? "rent" : "sale"}!`,
    });
    await notification.save();

    res.status(201).json({ message: "Car uploaded successfully", car: newCar });
  } catch (error) {
    console.error("Error uploading car:", error);
    res.status(500).json({ message: "Error uploading car", error });
  }
};

const deletecar = async (req, res) => {
  const { carId } = req.params;
  console.log("Deleting car with ID:", carId); // Debugging

  try {
    // Find and delete the car by ID
    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Failed to delete car" });
  }
};

const getcars = async (req, res) => {
  try {

    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};


const carDetails = async (req, res) => {
  try {
    const { id } = req.body

    const cars = await Car.findOne({_id:id});
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};



const cars = async (req, res) => {
  try {
    console.log(req.body)
    const cars = await Car.find({ type: req.body.type });
    res.json(cars);
  } catch (error)
   {    console.error("Error car book:", error);

    res.status(500).json({ message: "Error fetching cars", error });
  }
}


const updatestatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log("Updating car ID:", req.params.id); // Debugging log
    const car = await Car.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car status updated", car });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Error updating status", error });
  }
};

const getnotication=async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

const deletenotification= async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing notifications" });
  }
}
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car ID format" });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Server error while fetching car details" });
  }
};


module.exports = {
  uploadcar,
  deletecar,
  getcars,
  cars,
  carDetails,
  updatestatus,
  getnotication,
  deletenotification,
  getCarById
};
