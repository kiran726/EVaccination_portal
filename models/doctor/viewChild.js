var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)
var childSchema = require("../child/schema")
var Child = mongoose.model("Child",childSchema)

viewChild = (req,res) => {
    doctor.findById(req.user._id, (err,founddoctor) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("indexdoctor")
        }else{
            Child.findById(req.params.childId)
            .populate("parent")
            .populate("vaccine")
            .exec( (err,foundChild) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("indexdoctor") 
                }else{
                    if(foundChild.doctor == req.user._id){
                    res.render("doctor/viewChild",{ child : foundChild, doctor : founddoctor })
                    }else{
                        console.log(err)
                        req.flash("error","You Cannot Access This Page!!!")
                        res.redirect("indexdoctor") 
                    }
                }
            } )
        }
    } )
}
module.exports = viewChild