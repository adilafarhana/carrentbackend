const express=require("express");
const router= express.Router();
const authcontroller=require("../controller/Auth");
const carcontroller=require("../controller/Car");


router.get("/",(req,res)=>res.send("done"));

router.post("/signin",authcontroller.signin);
router.post("/signup",authcontroller.signup);
router.post("/carform",authcontroller.carform);


module.exports=router;