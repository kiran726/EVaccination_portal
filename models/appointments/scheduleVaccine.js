var mongoose = require("mongoose")
var childSchema = require("../child/schema")
var Child = mongoose.model("Child",childSchema)
var vaccineSchema = require("../vaccine/schema")
var Vaccine = mongoose.model("Vaccine",vaccineSchema)
var parentSchema = require("../parent/schema")
var Parent = mongoose.model("Parent",parentSchema)
var doctorSchema = require("../doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)

scheduleVaccine = (req,res) => {
    doctor.findById(req.user._id, (err,founddoctor) => {
        if(founddoctor){
            console.log("doctor")
    Child.findById(req.params.childId , (err,foundChild) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("indexdoctor") 
        }else{
            if(foundChild.doctor != req.user._id){
                console.log(err)
                req.flash("error","You Cannot Access This Page1!!!")
                res.redirect("indexdoctor") 
            }else{
                Vaccine.findById(foundChild.vaccine, (err,foundVaccine) => {
                    if(err){
                        console.log(err)
                        req.flash("error","Unexpected Error Occured!!!")
                        res.redirect("indexdoctor") 
                    }else{
                        foundVaccine.details[foundChild.vaccineNumberWorkingOn].schedule = req.body.date
                        foundVaccine.save( (err,savedVaccine) => {
                            if(err){
                                console.log(err)
                                req.flash("error","Unexpected Error Occured!!!")
                                res.redirect("indexdoctor") 
                            }else{
                                Vaccine.findByIdAndUpdate( foundChild.vaccine, savedVaccine, (err,updatedVaccine) => {
                                    if(err){
                                        console.log(err)
                                        req.flash("error","Unexpected Error Occured!!!")
                                        res.redirect("indexdoctor") 
                                    }else{
                                        foundChild.nextDate = req.body.date
                                        foundChild.save( (err,savedChild) => {
                                            if(err){
                                                console.log(err)
                                                req.flash("error","Unexpected Error Occured!!!")
                                                res.redirect("indexdoctor") 
                                            }else{
                                                Child.findByIdAndUpdate(req.params.childId,savedChild,(err,updatedChild)=>{
                                                    if(err){
                                                        console.log(err)
                                                        req.flash("error","Unexpected Error Occured!!!")
                                                        res.redirect("indexdoctor") 
                                                    }else{
                                                        Parent.findById(foundChild.parent, (err,foundParent) => {
                                                            if(err){
                                                                console.log(err)
                                                                req.flash("error","Unexpected Error Occured!!!")
                                                                res.redirect("indexdoctor") 
                                                            }else{
                                                                var name = "";
                                                                if( req.user.fname != "" ){
                                                                    name = req.user.fname + " " + req.user.lname 
                                                                }else{
                                                                    name = req.user.username
                                                                }
                                                                var newNotification = {
                                                                    what : "Next appointment for " + foundChild.fname + " is " + req.body.date , from : name,
                                                                    when : Date.now(),image : foundChild.image
                                                                }
                                                                if(foundParent.notifications.length == 5 ){
                                                                    foundParent.notifications = foundParent.notifications.slice(0,3)
                                                                }
                                                                foundParent.notifications.unshift(newNotification)
                                                                foundParent.save( (err,savedParent) => {
                                                                    if(err){
                                                                        console.log(err)
                                                                        req.flash("error","Unexpected Error Occured!!!")
                                                                        res.redirect("indexdoctor") 
                                                                    }else{
                                                                        Parent.findByIdAndUpdate(foundChild.parent,savedParent,(err,updatedParent)=>{
                                                                            if(err){
                                                                                console.log(err)
                                                                                req.flash("error","Unexpected Error Occured!!!")
                                                                                res.redirect("indexdoctor") 
                                                                            }else{
                                                                                req.flash("success","Data Updated Successfully!!!")
                                                                                res.redirect("viewChild-" + req.params.childId)
                                                                            }
                                                                        })
                                                                    }
                                                                } )
                                                            }
                                                        } )
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
    else{
        console.log("parent")
        Child.findById(req.params.childId , (err,foundChild) => {
            console.log("child")
            if(err){
                console.log("child1")
                console.log(err)
                req.flash("error","Unexpected Error Occured!!!")
                res.redirect("indexParent") 
            }else{
                console.log("z")
                if(foundChild.parent != req.user._id){
                    console.log(err)
                    console.log("e")
                    req.flash("error","You Cannot Access This Page!!!")
                    res.redirect("indexParent") 
                }else{
                    Vaccine.findById(foundChild.vaccine, (err,foundVaccine) => {
                        console.log("vaccine")
                        if(err){
                            console.log(err)

                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("indexParent") 
                        }else{
                            console.log("vaccine1")
                            foundVaccine.details[foundChild.vaccineNumberWorkingOn].schedule = req.body.date
                            foundVaccine.save( (err,savedVaccine) => {
                                if(err){
                                    console.log("1")
                                    console.log(err)
                                    req.flash("error","Unexpected Error Occured!!!")
                                    res.redirect("indexParent") 
                                }else{
                                    console.log("2")
                                    Vaccine.findByIdAndUpdate( foundChild.vaccine, savedVaccine, (err,updatedVaccine) => {
                                        if(err){
                                            console.log(err)
                                            console.log("3")
                                            req.flash("error","Unexpected Error Occured!!!")
                                            res.redirect("indexParent") 
                                        }else{
                                            console.log("4")
                                            foundChild.nextDate = req.body.date
                                            foundChild.save( (err,savedChild) => {
                                                if(err){
                                                    console.log("5")
                                                    console.log(err)
                                                    req.flash("error","Unexpected Error Occured!!!")
                                                    res.redirect("indexParent") 
                                                }else{
                                                    console.log("6")
                                                    Child.findByIdAndUpdate(req.params.childId,savedChild,(err,updatedChild)=>{
                                                        if(err){
                                                            console.log("7")
                                                            console.log(err)
                                                            req.flash("error","Unexpected Error Occured!!!")
                                                            res.redirect("indexParent") 
                                                        }else{
                                                            console.log("8")
                                                            Parent.findById(foundChild.parent, (err,foundParent) => {
                                                                if(err){
                                                                    console.log("9")
                                                                    console.log(err)
                                                                    req.flash("error","Unexpected Error Occured!!!")
                                                                    res.redirect("indexParent") 
                                                                }else{
                                                                    console.log("10")
                                                                    var name = "";
                                                                    if( req.user.fname != "" ){
                                                                        name = req.user.fname + " " + req.user.lname 
                                                                    }else{
                                                                        name = req.user.username
                                                                    }
                                                                    var newNotification = {
                                                                        what : "Next appointment for " + foundChild.fname + " is " + req.body.date , from : name,
                                                                        when : Date.now(),image : foundChild.image
                                                                    }
                                                                    if(foundParent.notifications.length == 5 ){
                                                                        foundParent.notifications = foundParent.notifications.slice(0,3)
                                                                    }
                                                                    foundParent.notifications.unshift(newNotification)
                                                                    foundParent.save( (err,savedParent) => {
                                                                        if(err){
                                                                            console.log("11")
                                                                            console.log(err)
                                                                            req.flash("error","Unexpected Error Occured!!!")
                                                                            res.redirect("indexParent") 
                                                                        }else{
                                                                            console.log("12")
                                                                            Parent.findByIdAndUpdate(foundChild.parent,savedParent,(err,updatedParent)=>{
                                                                                if(err){
                                                                                    console.log("13")
                                                                                    console.log(err)
                                                                                    req.flash("error","Unexpected Error Occured!!!")
                                                                                    res.redirect("indexParent") 
                                                                                }else{
                                                                                    console.log("14")
                                                                                    req.flash("success","Data Updated Successfully!!!")
                                                                                    res.redirect("childInfo-" + req.params.childId)
                                                                                }
                                                                            })
                                                                        }
                                                                    } )
                                                                }
                                                            } )
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

    })

}
module.exports = scheduleVaccine