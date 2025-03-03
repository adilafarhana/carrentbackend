// helper/index.js
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const multer = require("multer");

const comparePasswords = async (inputPassword, storedPassword) => {
  const isMatch = await bcrypt.compare(inputPassword, storedPassword);
  return isMatch;
};

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const generateToken = (data) => {
  const token = jsonwebtoken.sign(data, "task-app", { expiresIn: "1d" });
  return token;
};
const verifytoken = async(token) => {
  const decoded = await  jsonwebtoken.verify(token,"task-app",);
  return decoded

}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("images", 5);


module.exports = {
  comparePasswords,
  generateHashedPassword,
  generateToken,
  upload,
  verifytoken
};
