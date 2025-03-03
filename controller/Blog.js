const Car = require('../models/Blog');
const upload = require('../helper/index'); 
const Blog = require('../models/Blog');


const uploadblog = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("Uploaded files:", req.files);


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { title, content,  } = req.body;
    const userId = req.user.id;
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const newBlog = new Blog({
      title,
      content,
    images: imagePaths,
    postedBy:userId,
    });

    await newBlog.save();
    res.status(201).json({ message: "blog uploaded successfully", Blog: newBlog });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ message: "Error uploading blog", error });
  }
};

const deleteblog= async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found!" });
    }
    res.json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
}

const getblogs = async (req, res) => {
  try {
    const cars = await Blog.find().populate("postedBy").exec()


    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


const Blogs= async (req, res) => {
  try {
    const Blogs = await Blog.find().populate("postedBy",'name').exec()
    res.json(Blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
}



module.exports = {
  uploadblog,
  deleteblog,
  getblogs,
Blogs
};
