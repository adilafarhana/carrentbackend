const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],  
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
