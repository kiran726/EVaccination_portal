var express = require("express")
var router = express.Router();

var scheduleVaccine = require("../models/appointments/scheduleVaccine")
var appointmentAttended = require("../models/appointments/attended")
var appointmentMissed = require("../models/appointments/missed")

router.put("/scheduleVaccine-:childId",isparentLoggedIn,scheduleVaccine)
router.put("/scheduleVaccine-:childId",isdoctorLoggedIn,scheduleVaccine)

router.get("/appointmentAttended-:childId",isdoctorLoggedIn,appointmentAttended)
router.get("/appointmentMissed-:childId",isdoctorLoggedIn,appointmentMissed)

function isdoctorLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "YOU MUST LOG IN FIRST!!!" )
        res.redirect("/signindoctor")
    }
}
function isparentLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "YOU MUST LOG IN FIRST!!!" )
        res.redirect("/signinparent")
    }
}

module.exports = router