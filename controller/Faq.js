const express = require("express");
const router = express.Router();
const FAQ = require("../models/FAQ");

// Get all FAQs
const faqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    console.log("Sending FAQs:", faqs); // Debugging line
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Error fetching FAQs" });
  }
};


// Add a new FAQ (Admin)
const postfaqs = async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const newFAQ = new FAQ({ question, answer, category });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ message: "Error adding FAQ" });
  }
};

const editFAQ = async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, { question, answer, category }, { new: true });
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ" });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ" });
  }
};

module.exports = {postfaqs,faqs,editFAQ,deleteFAQ};
