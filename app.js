const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer=require("multer")
const jsonwebtoken = require("jsonwebtoken"); 
const adminModel = require("./models/admin");
const Car=require("./models/car")
const Blog = require('./models/Blog');
 // Adjust the path based on your project structure


const app = express(); // Initialize Express app

app.use(cors());
app.use(express.json()); // Middleware to parse JSON body

mongoose.connect(
  "mongodb+srv://adilafarhanavv:0987adi7890@cluster0.4nikuym.mongodb.net/carapp?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
);


const generateHashedPassword = async (password) => {
  try {
      const salt = await bcrypt.genSalt(10); // Salt is a cost factor
      return await bcrypt.hash(password, salt);
  } catch (error) {
      console.error("Error generating hashed password", error);
      throw error;
  }
};


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ status: "Error", message: "Incorrect password" });
    }

    const token = jsonwebtoken.sign({ email: admin.email }, "task-app", { expiresIn: "1d" });

    res.json({ status: "Success", userid: admin._id, token });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ status: "Error", message: "An error occurred. Please try again." });
  }
});



app.post("/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);

    let input = req.body;

    // Check if the email is already registered
    const existingUser = await adminModel.findOne({ email: input.email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already registered" });
    }

    // Hash the password before saving
    let hashedPassword = await generateHashedPassword(input.password);
    input.password = hashedPassword;

    let newUser = new adminModel(input);
    await newUser.save();

    console.log("User successfully registered:", newUser);
    res.json({ status: "SIGNUP" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});




// app.post('searchcars', async (req, res) => {
//   const { budget, brand, model } = req.body;

//   try {
//     const query = {};
    
//     if (budget) {
//       query.price = { $lte: budget };
//     }
    
//     if (brand) {
//       query.brand = { $regex: brand, $options: 'i' }; // Case-insensitive brand match
//     }
    
//     if (model) {
//       query.model = { $regex: model, $options: 'i' }; // Case-insensitive model match
//     }

//     // Find cars matching the query
//     const cars = await Car.find(query);

//     // If no cars are found, send an empty array instead of null or undefined
//     if (!cars) {
//       return res.status(404).json([]);
//     }

//     // Return the cars in the response as JSON
//     res.json(cars);
//   } catch (err) {
//     console.error('Error searching cars:', err);
//     res.status(500).json({ message: 'Error searching for cars' });
//   }
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Dummy in-memory database (replace with a real database in production)
let cars = [];
app.post("/uploadcar", upload.array("images", 5), async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("Uploaded files:", req.files);

    const { brand, model, price, description, type } = req.body;
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // Create new car entry in the database
    const newCar = new Car({
      brand,
      model,
      price,
      description,
      type,
      images: imagePaths,
    });

    // Save the car to the database
    await newCar.save();

    res.status(201).json({ message: "Car uploaded successfully", car: newCar });
  } catch (error) {
    console.error("Error uploading car:", error);
    res.status(500).json({ message: "Error uploading car", error });
  }
});

// Get All Cars API
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
});


// Example in Express.js
app.delete('/deletecar/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    // Delete the car from your database
    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete car" });
  }
});


app.get('/getcars', async (req, res) => {
  try {
    const cars = await Car.find();  // Fetch all cars from the database
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});





//blog


// Configure multer for file uploads


// Mock database (Replace with MongoDB or MySQL)
let blogs = [];

app.post("/rentblogs", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newBlog = { title, content, image: imageUrl };
  // Save to database (or a temporary array for testing)

  res.json({ success: true, blog: newBlog });
});

app.get("/rentblogs", (req, res) => {
  res.json(blogs);
});









//rent blogs.....................
app.post("/uploadblog", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = new Blog({ title, content, image });
    await newBlog.save();

    res.status(201).json({ message: "Blog uploaded successfully!" });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to upload blog." });
  }
});

// Get All Blogs Route
// Example in Express.js
// Example Express.js code to return blogs from the database
app.get("/getblogs", async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs from the database
    console.log(blogs); // Check if data is being fetched correctly
    res.json(blogs); // Send the blog data back to the client
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Server error");
  }
});





app.use("/uploads", express.static("uploads"));
// Start server
app.listen(3030, () => {
  console.log("server started0");
});
