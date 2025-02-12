const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Store image as Base64 or URL
  createdAt: { type: Date, default: Date.now }, // Auto timestamp
});

module.exports = mongoose.model("Blog", blogSchema);
