var mongoose = require("mongoose")
var passport = require("passport")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)
var nodemailer = require("nodemailer")
var otpSchema = require("../otp/otpSchema")
var OTP = mongoose.model("OTP",otpSchema)
signup = (req, res) => {
        doctor.findOne({ username : req.body.username }, (err, sameName ) => {
            if(err){
                console.log(err)
                req.flash("error","Unexpected Error Occurs!!!")
                res.redirect("/signupdoctor")
            }else{
                if(sameName){
                    req.flash("error","Username already taken!!!")
                    res.redirect("/signupdoctor")
                }else{
                    doctor.findOne({ email : req.body.email }, (err, sameEmail ) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occurs!!!")
                            res.redirect("/signupdoctor")
                        }else{
                            if(sameEmail){
                                req.flash("error","Email Already In Use!!!")
                                res.redirect("/signupdoctor")
                            }else{
                                const smtpTrans = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: process.env.EMAIL_ID,
                                        pass: process.env.PASSWORD
                                    }
                                })
                                otp = Math.floor(Math.random() * 1000000)
                                console.log(otp);
                                /*const mailOpts = {
                                    from: "kiranvpn0@gmail.com",
                                    to: req.body.email,
                                    subject: 'Verify Email Address',
                                    text: "Hi," + "\n\n" + 
                                    "To proceed further with your account verification at E - Vaccination , Please use the 6-digit OTP given below.This OTP is only valid for 60 minutes"
                                    + "\n\n" + 
                                    otp + "\n\n" + 
                                    "Regards," +
                                    "Team ,E - Vaccination"
                                }
                                smtpTrans.sendMail(mailOpts, (error, response) => {
                                    if (error) {
                                        console.log(error)
                                        req.flash("error","Cannot Verify Your Email Right Now1 !!!")
                                        res.redirect("/signupdoctor") // Show a page indicating failure
                                    }*/
                                    // else {
                                        var now = new Date();
                                        OTP.create({
                                            timeOfSending : now,
                                            otp : otp,
                                            email : req.body.email,
                                            username : req.body.username,
                                            password : req.body.password
                                        } , (err,createOtp) => {
                                            if(err){
                                                console.log(error)
                                                req.flash("error","Cannot Verify Your Email Right Now2 !!!")
                                                res.redirect("/signupdoctor") 
                                            }else{
                                                res.redirect("/otpdoctor-" + req.body.email + "-" + createOtp.id )
                                            }
                                        } )
                                    // }
                                // })
                            }
                        }
                    } )
                }
            }
        } )
}

module.exports = signup