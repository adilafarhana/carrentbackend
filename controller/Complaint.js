// controllers/complaintController.js
const ComplaintModel = require("../models/compliant");
const mongoose = require("mongoose");

// Submit a complaint
const complaints = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Log the request body
  
      const { name, ComplaintType, PriorityLevel, DateFilled, ContactNo, userid } = req.body;
  
      // Validate required fields
      if (!name || !ComplaintType || !PriorityLevel || !DateFilled || !ContactNo || !userid) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
      }
  
      // Validate date format
      if (isNaN(new Date(DateFilled).getTime())) {
        return res.status(400).json({ status: "error", message: "Invalid date format" });
      }
  
      // Create a new complaint
      const newComplaint = new ComplaintModel({
        name,
        ComplaintType,
        PriorityLevel,
        DateFilled,
        ContactNo,
        userid: new mongoose.Types.ObjectId(userid), // Use `new` keyword to create ObjectId
      });
  
      await newComplaint.save();
      res.json({ status: "success", data: newComplaint });
    } catch (error) {
      console.error("Error saving complaint:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  
// Get all complaints (Admin)
const complaintList = async (req, res) => {
    try {
      const data = await ComplaintModel.find().populate("userid", "name").exec();
      res.json(data);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

// Get complaints for a specific user
const ownComplaint = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const complaints = await ComplaintModel.find({ userid: userId });
    res.status(200).json({ status: "success", complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update complaint status (Admin)
const updateComplaintStatus = async (req, res) => {
    const { id } = req.params; // Get the complaint ID from the URL
    const { status } = req.body; // Get the new status from the request body
  
    try {
      const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
        id,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!updatedComplaint) {
        return res.status(404).json({ status: "error", message: "Complaint not found" });
      }
  
      res.json({ status: "success", data: updatedComplaint });
    } catch (error) {
      console.error("Error updating complaint status:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  };

// Delete a complaint (Admin)
const deleteComplaint = async (req, res) => {
    const { id } = req.params; // Get the complaint ID from the URL
  
    try {
      const deletedComplaint = await ComplaintModel.findByIdAndDelete(id);
  
      if (!deletedComplaint) {
        return res.status(404).json({ status: "error", message: "Complaint not found" });
      }
  
      res.json({ status: "success", message: "Complaint deleted successfully" });
    } catch (error) {
      console.error("Error deleting complaint:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  };

module.exports = { complaints, complaintList, deleteComplaint, ownComplaint, updateComplaintStatus };