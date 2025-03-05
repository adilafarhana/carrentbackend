const Car = require('../models/car');
const upload = require('../helper/index');

const uploadcar = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("Uploaded files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { brand, model, price, description, type, rentalPricePerHour,specialOffers, discountPercentage } = req.body;
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    const discountedPrice = discountPercentage ? price - (price * (discountPercentage / 100)) : price;


    const newCar = new Car({
      brand,
      model,
      price,
      description,
      type,
      images: imagePaths,
      rentalPricePerHour: type === "Rent" ? rentalPricePerHour : undefined,
      specialOffers: "",
      discountPercentage: discountPercentage || 0,
    });

    await newCar.save();
    res.status(201).json({ message: "Car uploaded successfully", car: newCar });
  } catch (error) {
    console.error("Error uploading car:", error);
    res.status(500).json({ message: "Error uploading car", error });
  }
};




const deletecar = async (req, res) => {
  const { carId } = req.params;
  console.log("Deleting car with ID:", carId);

  try {
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



module.exports = {
  uploadcar,
  deletecar,
  getcars,
  cars,
  carDetails
};
