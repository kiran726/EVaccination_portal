var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

addEduInfo = (req,res) => {
    doctor.findById(req.user._id, (err, founddoctor) => {
        if(err){
            console.log(err)
            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
            res.redirect("indexdoctor")
        }else{
            var newEduPackage = {
                year : req.body.yearOfQ,
                degree : req.body.degree,
                institute : req.body.institute,
                result : req.body.result
            }
            founddoctor.education.unshift(newEduPackage)
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

module.exports = addEduInfo