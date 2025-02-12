const bcrypt = require("bcrypt")
const json = require("jsonwebtoken")
const multer = require("multer")

const isMatch = await bcrypt.compare(password, admin.password);
if (!isMatch) {
    return res.status(401).json({ status: "Error", message: "Incorrect password" });
}

const token = jsonwebtoken.sign({ email: admin.email }, "task-app", { expiresIn: "1d" });

res.json({ status: "Success", userid: admin._id, token });


let hashedPassword = await generateHashedPassword(input.password);
input.password = hashedPassword;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });

module.exports = {
    isMatch,
    token,
    hashedPassword,
    storage,
    upload
}