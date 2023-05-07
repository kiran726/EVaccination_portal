var express = require("express")
var router = express.Router();
var mongoose = require("mongoose")
var passport = require("passport") 

var otpSchema = require("../models/otp/otpSchema")
var OTP = mongoose.model("OTP", otpSchema)

var verifyOTPparent = require("../models/otp/verifyOtpParent") 
var verifyOTPdoctor = require("../models/otp/verifyOtpdoctor")

router.get("/otp-:email-:id", (req,res) => {
    res.render("Parent/otp",{ otpId : req.params.id, email : req.params.email , page : "Verify Email Address"  })
} )
router.get("/otpdoctor-:email-:id", (req,res) => {
    res.render("doctor/otp",{ otpId : req.params.id, email : req.params.email , page : "Verify Email Address"  })
} )
router.post("/verifyEmailParent-:otpId",verifyOTPparent )
router.post("/verifyEmaildoctor-:otpId",verifyOTPdoctor)
module.exports = router