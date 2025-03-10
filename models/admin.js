const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },

    isAdmin: { type: Boolean, required:true,default: false } 
});

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
