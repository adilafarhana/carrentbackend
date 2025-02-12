const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String, // Make sure the image path is stored correctly
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
