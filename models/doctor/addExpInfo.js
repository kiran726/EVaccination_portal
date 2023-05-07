var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

addExpInfo = (req,res) => {
    doctor.findById(req.user._id, (err, founddoctor) => {
        if(err){
            console.log(err)
            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
            res.redirect("indexdoctor")
        }else{
            var newExpPackage = {
                year : req.body.yearOfQ,
                department : req.body.dept,
                position : req.body.position,
                hospital : req.body.hospital,
                feedback : req.body.feedback
            }
            founddoctor.experience.unshift(newExpPackage)
            founddoctor.save( (err,saveddoctor) => {
                if(err){
                    console.log(err)
                    req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                    res.redirect("indexdoctor")
                }else{
                    doctor.findByIdAndUpdate(req.user._id, saveddoctor ,(err,updateddoctor) => {
                        if(err){
                            console.log(err)
                            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                            res.redirect("indexdoctor")
                        }else{
                            req.flash("success","DATA ADDED SUCCESSFULLY!!!")
                            res.redirect("profiledoctor")
                        }
                    } )
                }
            } )
        }
    } )
}

module.exports = addExpInfo