var mongoose = require("mongoose")
var childSchema = require("./schema")
var Child = mongoose.model("Child",childSchema)
var doctorSchema = require("../doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)

makePayment = (req,res) => {
    Child.findById(req.params.childId,  (err,foundChild) => {
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
                        foundChild.doctor = founddoctor;
                        foundChild.save( (err,savedChild) => {
                            if(err){
                                console.log(err)
                                req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                res.redirect("childInfo-" + req.params.childId)
                            }else{
                                Child.findByIdAndUpdate( req.params.childId, savedChild ,(err, updatedChild ) => {
                                    if(err){
                                        console.log(err)
                                        req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                        res.redirect("childInfo-" + req.params.childId)
                                    }else{
                                        var list = founddoctor.patients
                                        if(list == undefined){
                                            list = []
                                        }
                                        list.push(foundChild)
                                        founddoctor.patients = list
                                        var newNotification = {
                                            what : foundChild.fname + "  " + foundChild.lname + " has appointed you." , 
                                            when : Date.now(),image : foundChild.image
                                        }
                                        if(founddoctor.notifications.length == 5 ){
                                            founddoctor.notifications = founddoctor.notifications.slice(0,3)
                                        }
                                        founddoctor.notifications.unshift(newNotification)
                                        founddoctor.save( (err,saveddoctor) => {
                                            if(err){
                                                console.log(err)
                                                req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                                res.redirect("childInfo-" + req.params.childId) 
                                            }else{
                                                doctor.findByIdAndUpdate(req.params.doctorId,saveddoctor,(err,updateddoctor)=>{
                                                    if(err){
                                                        console.log(err)
                                                        req.flash("error","UNEXPECTED ERROR OCCURED!!!")
                                                        res.redirect("childInfo-" + req.params.childId)
                                                    }else{
                                                        req.flash("success",updateddoctor.username + " has been appointed to" + updatedChild.fname)
                                                        res.redirect("childInfo-" + req.params.childId)
                                                    }
                                                })
                                            }
                                        } )
                                    }
                                } )
                            }
                        } )
                    }
                } )
            }
        }
    } )
}

module.exports = makePayment