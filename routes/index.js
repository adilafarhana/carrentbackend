const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/Auth");
const carcontroller = require("../controller/Car");
const { upload } = require("../helper/index"); 
const authMiddleware = require('../middleware/auth')
const blogcontroller=require("../controller/Blog")
const bookingcontroller=require("../controller/Bookingcar")
const usedcarpurchasecontroller=require("../controller/Bookingused")



router.get("/", (req, res) => res.send("done"));

router.post("/login", authcontroller.login);
router.post("/signup", authcontroller.signup);


router.delete("/deletecar/:carId", carcontroller.deletecar); 
router.get("/getcars", authMiddleware.adminRequird, carcontroller.getcars);
router.post("/uploadcar", upload, authMiddleware.adminRequird, carcontroller.uploadcar); 
router.post("/cars", carcontroller.cars);

router.get("/viewuser",authMiddleware.adminRequird, authcontroller.viewuser);

router.get("/userProfile",authMiddleware.userRequird, authcontroller.userProfile);

router.post("/uploadblog",upload,authMiddleware.userRequird, blogcontroller.uploadblog);
router.delete("/deleteblog/:id",authMiddleware.userRequird, blogcontroller.deleteblog);


router.get("/getblogs",authMiddleware.userRequird, blogcontroller.getblogs);
router.post("/postbooking", authMiddleware.userRequird, bookingcontroller.postbooking);
router.post("/getbooking", authMiddleware.adminRequird, bookingcontroller.getbooking);
router.post("/updateOrderStatus", authMiddleware.adminRequird, bookingcontroller.updateOrderStatus);
router.post("/userBookings/:id", authMiddleware.userRequird, bookingcontroller.userBookings);



router.post("/postPurchase", authMiddleware.userRequird, usedcarpurchasecontroller.postPurchase);
router.get("/getPurchases", authMiddleware.adminRequird, usedcarpurchasecontroller.getPurchases);
router.post("/carDetails", authMiddleware.userRequird, carcontroller.carDetails);


router.get("/Bookingdetails", authMiddleware.userRequird, bookingcontroller.Bookingdetails);





router.get("/Blogs", blogcontroller.Blogs);







module.exports = router;
