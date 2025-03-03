const bcrypt = require("bcrypt");
const adminModel = require('../models/admin');
const json = require("jsonwebtoken");

const { generateHashedPassword, comparePasswords, generateToken } = require('../helper/index');



const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(res.data)

  try {


    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    const isMatch = await comparePasswords(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ status: "Error", message: "Incorrect password" });
    }

    const token = generateToken({email:admin.email,userId:admin?._id,isAdmin:true});


    res.json({ status: "Success", userId: admin?._id, name: admin?.name, token, isAdmin: admin?.isAdmin || "false" });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ status: "Error", message: "An error occurred. Please try again." });
  }
}

const signup = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);

    let input = req.body;

    const existingUser = await adminModel.findOne({ email: input.email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    input.password = hashedPassword;

    let newUser = new adminModel(input);
    await newUser.save();

    console.log("User successfully registered:", newUser);
    res.status(201).json({ status: "success", message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};



const viewuser = async (req, res) => {
  adminModel.find().then(
      (data) => {
          res.json(data)
      }
  ).catch(
      (error) => {
          res.json(error)
       }
    )
}


const userProfile = async (req, res) => {
    try {
        const user = await adminModel.findOne({ _id: req.user.id }).select("-password")
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.status(200).json({ status: "success", user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });

    }
}




module.exports = {
  login,
  signup,
  viewuser,
  userProfile
  
};
