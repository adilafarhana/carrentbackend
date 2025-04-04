// helper/index.js
const bcrypt= require("bcryptjs");
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

function calculateLatePenalty(lateHours, baseAmount) {
  if (lateHours <= 0) return 0;
  const penalty = baseAmount * PENALTY_RATE_PER_HOUR * lateHours;
  const minimumPenalty = baseAmount * MINIMUM_PENALTY_PERCENTAGE;
  return Math.max(penalty, minimumPenalty);
}

// Helper function to calculate damage penalty
function calculateDamagePenalty(condition, baseAmount) {
  const damageRates = {
    "Excellent": 0,
    "Good": 0,
    "Fair": baseAmount * 0.05,
    "Poor": baseAmount * 0.1,
    "Damaged": baseAmount * 0.2
  };
  return damageRates[condition] || 0;
}



const upload = multer({ storage }).array("images", 5);


module.exports = {
  comparePasswords,
  generateHashedPassword,
  generateToken,
  upload,
  verifytoken,
  calculateLatePenalty,
};
