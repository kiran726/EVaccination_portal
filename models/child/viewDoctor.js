var mongoose = require("mongoose")
var childSchema = require("./schema")
var Child = mongoose.model("Child",childSchema)
var doctorSchema = require("../doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)

viewdoctor = (req ,res ) => {
    Child.findById(req.params.childId)
    .populate("parent")
    .populate("vaccine")
    .populate("doctor")
    .exec((err,foundChild) => {
        if(err){
            console.log(err)
            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
            res.redirect("childInfo-" + req.params.childId)
        }else{
            if(foundChild.parent._id == req.params._id ){
                console.log(err)
                req.flash("error","You cannot access this page!!!")
                res.redirect("signinParent")
            }else{
                doctor.findById(req.params.doctorId, (err,founddoctor) => {
                    if(err){
                        console.log(err)
                        req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                        res.redirect("childInfo-" + req.params.childId)
                    }else{
                        res.render("Parent/viewdoctor", { child : foundChild, parent : foundChild.parent, doctor : founddoctor } )
                    }
                } )
            }
        }
    } )
}

module.exports = viewdoctor