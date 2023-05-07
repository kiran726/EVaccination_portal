var express = require("express")
var router = express.Router();
var passport = require("passport")
var mongoose = require("mongoose")
var doctorSchema = require("../models/doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)

var doctorSignup = require("../models/doctor/signup")
var doctorProfile = require("../models/doctor/profile")
var doctorEditProfile = require("../models/doctor/editProfile")
var doctorEditProfilePic = require("../models/doctor/editProfilePic")
var doctorEditProfilePersonal = require("../models/doctor/editPersonal")
var addEducationInfo = require("../models/doctor/addEduInfo")
var delteEduInfo = require("../models/doctor/deleteEduInfo")
var addExpInfo = require("../models/doctor/addExpInfo")
var deleteExpInfo = require("../models/doctor/deleteExpInfo")
var viewChild = require("../models/doctor/viewChild")

router.get("/signupdoctor", ( req,res ) => {
    res.render("doctor/signup", { page : "Signup"  } )
} )  

router.post("/signupdoctor", doctorSignup )

router.get("/signindoctor", ( req, res ) => {
    res.render("doctor/signin", { page : "Signin"  })
} )

router.post("/signindoctor", passport.authenticate("doctor",{
    failureRedirect : "/wrongCredentials-doctor" ,
    }), isdoctorLoggedIn, (req,res) => {
        req.flash("success","Welcome " + req.user.username )
        res.redirect("/indexdoctor")
    }
)

router.get("/indexdoctor",isdoctorLoggedIn, (req, res) => {
    doctor.findById(req.user._id)
    .populate("patients")
    .exec((err,founddoctor) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("/signindoctor")
        }else{
            res.render("doctor/index", { doctor : founddoctor } )
        }
    } )
} )
router.get("/profiledoctor",isdoctorLoggedIn, doctorProfile)

router.get("/editProfile",isdoctorLoggedIn,doctorEditProfile)
router.put("/editProfilePic",isdoctorLoggedIn,doctorEditProfilePic)
router.put("/editdoctorPersonal",isdoctorLoggedIn,doctorEditProfilePersonal )

router.put("/addEducationInfo",isdoctorLoggedIn,addEducationInfo)
router.put("/deleteEdu-:index",isdoctorLoggedIn,delteEduInfo)
router.put("/addExpInfo",isdoctorLoggedIn,addExpInfo)
router.put("/deleteExp-:index",isdoctorLoggedIn,deleteExpInfo)
router.get("/viewChild-:childId",isdoctorLoggedIn,viewChild)

function isdoctorLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "YOU MUST LOG IN FIRST!!!" )
        res.redirect("/signindoctor")
    }
}

module.exports = router