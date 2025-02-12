const Car = require('../models/car'); // Assuming you have a Car model
const multer = require("multer");

// Set up multer storage engine using arrow functions

const upload = multer({ storage });

// Arrow function for uploading car details
// exports.uploadCarDetails = [
//   upload.array('images', 10),
//   async (req, res) => {
//     try {
//       const { brand, model, price, description, type } = req.body;
//       const imagePaths = req.files.map((file) => file.path);

//       const newCar = new Car({
//         brand,
//         model,
//         price,
//         description,
//         type,
//         images: imagePaths,
//       });

//       await newCar.save();

//       res.status(200).json({ message: 'Car details uploaded successfully' });
//     } catch (error) {
//       console.error('Error saving car details:', error);
//       res.status(500).json({ message: 'Failed to upload car details' });
//     }
//   },
// ];

app.post("/upload", upload.array('images', 10), async (req, res) => {
  try {
    const { brand, model, price, description, type } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const newCar = new carModel({
      brand,
      model,
      price,
      description,
      type,
      images: imagePaths,
    });

    await newCar.save();

    res.status(200).json({ message: 'Car details uploaded successfully' });
  } catch (error) {
    console.error('Error saving car details:', error);
    res.status(500).json({ message: 'Failed to upload car details' });
  }
});


const multer = require('multer');
const carModel = require("./models/car");

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// const upload = multer({ storage });

const uploadcar= async (req, res) => {
  try {
    const { brand, model, price, description, type } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const newCar = new carModel({
      brand,
      model,
      price,
      description,
      type,
      images: imagePaths,
    });

    await newCar.save();

    res.status(200).json({ message: 'Car details uploaded successfully' });
  } catch (error) {
    console.error('Error saving car details:', error);
    res.status(500).json({ message: 'Failed to upload car details' });
  }
}


module.exports={
    uploadcar

}


