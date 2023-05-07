var express = require("express")
var router = express.Router();
var mongoose = require("mongoose")

var schema = require("../models/child/schema")
var Child = mongoose.model("Child",schema)

var childInfoParent = require("../models/child/childInfo")
var addImageChild = require("../models/child/addImageChild")
var viewdoctors = require("../models/child/viewdoctors")
var viewdoctor = require("../models/child/viewdoctor")
var appointdoctor = require("../models/child/appointdoctor")

router.get("/childInfo-:id",isParentLoggedIn,childInfoParent)
router.put("/addImage-:id",isParentLoggedIn,addImageChild)
router.get("/viewdoctorsBy-:childId",isParentLoggedIn,viewdoctors)
router.get("/viewdoctor-:doctorId-By-:childId",isParentLoggedIn,viewdoctor)
router.get("/appointdoctor-:doctorId-For-:childId",isParentLoggedIn,appointdoctor)

function isParentLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "YOU MUST LOG IN FIRST!!!" )
        res.redirect("/signinParent")
    }
}

module.exports = router