const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer=require("multer")
const jsonwebtoken = require("jsonwebtoken"); 
const adminModel = require("./models/admin");
const Car=require("./models/car")
const indexroute=require('./routes/index')
require('./config/db')
const app = express(); 

app.use(cors());
app.use(express.json()); 

app.use('/uploads', express.static('uploads'));













// let cars = [];










// let blogs = [];

// app.post("/rentblogs", upload.single("image"), (req, res) => {
//   const { title, content } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//   const newBlog = { title, content, image: imageUrl };
//   // Save to database (or a temporary array for testing)

//   res.json({ success: true, blog: newBlog });
// });

// app.get("/rentblogs", (req, res) => {
//   res.json(blogs);
// });









// //rent blogs.....................
// app.post("/uploadblog", upload.single("image"), async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     if (!title || !content) {
//       return res.status(400).json({ error: "Title and content are required." });
//     }

//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     const newBlog = new Blog({ title, content, image });
//     await newBlog.save();

//     res.status(201).json({ message: "Blog uploaded successfully!" });
//   } catch (error) {
//     console.error("Error saving blog:", error);
//     res.status(500).json({ error: "Failed to upload blog." });
//   }
// });


// app.get("/getblogs", async (req, res) => {
//   try {
//     const blogs = await Blog.find(); 
//     console.log(blogs); 
//     res.json(blogs); 
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     res.status(500).send("Server error");
//   }
// });





// app.use("/uploads", express.static("uploads"));

app.use('/',indexroute)
// Start server
app.listen(3030, () => {
  console.log("server started on 3030");
});
