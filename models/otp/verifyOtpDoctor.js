var mongoose = require("mongoose")
var doctorSchema = require("../doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)
var dateformat = require('dateformat')
var passport = require("passport")
var otpSchema = require("./otpSchema")
var OTP = mongoose.model("OTP",otpSchema)

verifyOtp = (req,res) => {
    OTP.findById(req.params.otpId, (err,foundOTP) => {
        if(err){
            console.log(err)
            req.flash("error","Cannot Verify Your Email Address Right Now!!!")
            res.redirect("/signupdoctor")
        }else{
            var now = new Date();
            var diff =(foundOTP.timeOfSending.getTime() - now.getTime()) / 1000;
            diff /= (60 * 60);
            diff < 0 ? diff = -diff : diff = diff;
            diff = Math.floor(diff);
            if(diff >= 1){
                OTP.findByIdAndDelete(req.params.otpId, (err,deletedOtp) => {
                    if(err){
                        console.log(err)
                        req.flash("error","Some Unexpected Error Occurred!!!")
                        res.redirect("/signupdoctor")
                    }else{
                        req.flash("error","This OTP has been expired!!!")
                        res.redirect("/signupdoctor")
                    }
                } )
            }else{
                if(foundOTP.otp != req.body.enteredOtp ){
                    req.flash("error","Wrong OTP Entered.. Try Again")
                    res.redirect("/otp-" + foundOTP.email + "-" + foundOTP.id )
                }else{
                    Dates = dateformat(now, 'mmm d yyyy h:MM:ss TT');
                    doctor.register({ username : foundOTP.username, email : foundOTP.email,
                        patients : [], image : "https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png",
                        specialization : "",address : "",country : "",pinCode : "",
                        alternateContact : "",joined : Date.now(),FacebookUrl: "",TwitterUrl: "",
                        InstagramUrl: "", LinkedinUrl: "",completedVaccinations : [],appointmentFee : "INR 0",
                        age : "", pictures : [], education : [], experience : [],notifications : []
                    }, foundOTP.password, (err ,newUser ) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occurs!!!")
                            res.redirect("/signupdoctor")
                        }else{
                            OTP.findByIdAndDelete(req.params.otpId,(err,deletedOtp) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","SOME ERROR OCCURED,TRY AGAIN")
                                    res.redirect("/signindoctor")
                                }else{
                                    req.flash("success","Hello " + foundOTP.username + " ... Please Login To Continue!!!" )
                                    res.redirect("/signindoctor")
                                }
                            })
                        }
                    } )
                }
            }
        }
    } )
}

module.exports = verifyOtp