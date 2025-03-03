const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
     user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin"
        }
        ,
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car"
        }
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
