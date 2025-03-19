const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/Auth");
const carcontroller = require("../controller/Car");
const { upload } = require("../helper/index"); 
const authMiddleware = require('../middleware/auth')
const blogcontroller=require("../controller/Blog")
const bookingcontroller=require("../controller/Bookingcar")
const usedcarpurchasecontroller=require("../controller/Bookingused")
const reviewusercontroller=require("../controller/Reviews")
const wishlistusercontroller=require("../controller/wishlistRoutes")
const alertusercontroller=require("../controller/alertRoutes")
const faqcontroller=require("../controller/Faq")
const complaintController=require("../controller/Complaint")



router.get("/", (req, res) => res.send("done"));

router.post("/login", authcontroller.login);
router.post("/signup", authcontroller.signup);


router.delete("/deletecar/:carId",authMiddleware.adminRequird,carcontroller.deletecar);

router.get("/getcars", authMiddleware.adminRequird, carcontroller.getcars);
router.post("/uploadcar", upload, authMiddleware.adminRequird, carcontroller.uploadcar); 
router.get("/getnotication",  authMiddleware.userRequird, carcontroller.getnotication); 
router.delete("/deletenotification",  authMiddleware.adminRequird, carcontroller.deletenotification); 
router.put("/updatestatus/:id", authMiddleware.adminRequird, carcontroller.updatestatus ); 
router.post("/cars", carcontroller.cars);

router.get("/viewuser",authMiddleware.adminRequird, authcontroller.viewuser);

router.get("/userProfile",authMiddleware.userRequird, authcontroller.userProfile);

router.post("/uploadblog",upload,authMiddleware.userRequird, blogcontroller.uploadblog);
router.delete("/deleteblog/:id",authMiddleware.userRequird, blogcontroller.deleteblog);


router.get("/getblogs",authMiddleware.userRequird, blogcontroller.getblogs);
router.post("/postbooking",upload, authMiddleware.userRequird, bookingcontroller.postbooking);
router.post("/getbooking", authMiddleware.adminRequird, bookingcontroller.getbooking);
router.post("/updateOrderStatus", authMiddleware.adminRequird, bookingcontroller.updateOrderStatus);

router.post("/userBookings/:id", authMiddleware.userRequird, bookingcontroller.userBookings);
router.post("/updatePaymentStatus", authMiddleware.adminRequird, bookingcontroller.updatePaymentStatus);


router.post("/postPurchase", authMiddleware.userRequird, usedcarpurchasecontroller.postPurchase);
router.get("/getPurchases", authMiddleware.adminRequird, usedcarpurchasecontroller.getPurchases);
router.post("/carDetails", authMiddleware.userRequird, carcontroller.carDetails);


router.post("/Bookingdetails", authMiddleware.userRequird, bookingcontroller.Bookingdetails);
router.post("/savePayment", authMiddleware.userRequird, bookingcontroller.savePayment);
router.get("/getPayments", authMiddleware.userRequird, bookingcontroller.getPayments);
router.post("/addReview", authMiddleware.userRequird, reviewusercontroller.addReview);
router.post("/viewReviews", authMiddleware.userRequird, reviewusercontroller.viewReviews);
router.get("/faqs", authMiddleware.userRequird, faqcontroller.faqs);
router.post("/postfaqs", authMiddleware.adminRequird, faqcontroller.postfaqs);
router.put("/editFAQ/:id", authMiddleware.adminRequird, faqcontroller.editFAQ);
router.delete("/deleteFAQ/:id", authMiddleware.adminRequird, faqcontroller.deleteFAQ);

router.post("/add", authMiddleware.userRequird, wishlistusercontroller.add);
router.get("/get", authMiddleware.userRequird, wishlistusercontroller.get);
router.delete("/remove", authMiddleware.userRequird, wishlistusercontroller.remove);

router.post("/check", authMiddleware.userRequird, alertusercontroller.check);

router.post("/complaints", authMiddleware.userRequird, complaintController.complaints);
router.get("/complaintList", authMiddleware.adminRequird, complaintController.complaintList);
router.delete("/deleteComplaint", authMiddleware.adminRequird, complaintController.deleteComplaint);
router.get("/ownComplaint", authMiddleware.userRequird, complaintController.ownComplaint);
router.post("/updateComplaintStatus", authMiddleware.adminRequird, complaintController.updateComplaintStatus);

router.put("/complaints/:id", authMiddleware.adminRequird, complaintController.updateComplaintStatus);
router.delete("/complaints/:id", authMiddleware.adminRequird, complaintController.deleteComplaint);









router.get("/Blogs", blogcontroller.Blogs);







module.exports = router;
