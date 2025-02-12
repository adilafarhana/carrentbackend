
const bcrypt=require("bcrypt")
const adminModel=require('../models/admin')
const json=require("jsonwebtoken")


const login=async (req, res) => {
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
  }
  
  
  
 const signup= async (req, res) => {
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
  }
  

  module.exports={
    login,
    signup

  };