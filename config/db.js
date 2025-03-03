//config/db.js
const mongoose = require("mongoose")


mongoose.connect(
    "mongodb+srv://adilafarhanavv:0987adi7890@cluster0.4nikuym.mongodb.net/carapp?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  