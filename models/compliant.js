// models/complaint.js
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, required: true },
  ComplaintType: { type: String, required: true },
  PriorityLevel: { type: String, required: true },
  DateFilled: { type: String, required: true },
  ContactNo: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }, // Reference to the user who submitted the complaint
});

const ComplaintModel = mongoose.model("complaints", schema);

module.exports = ComplaintModel;