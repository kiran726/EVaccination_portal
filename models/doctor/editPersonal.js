var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

editPersonal = (req, res) => {
    console.log("at right route")
    doctor.findById(req.user._id, ( err ,founddoctor ) => {
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occurs!!!")
            res.redirect("indexdoctor")
        }else{
            founddoctor.fname = req.body.fname;founddoctor.lname = req.body.lname;
            founddoctor.city = req.body.city;founddoctor.dob = req.body.dob;
            founddoctor.country = req.body.country;founddoctor.age = req.body.age;
            founddoctor.state = req.body.state;founddoctor.address = req.body.address;
            founddoctor.pinCode = req.body.pinCode,founddoctor.specialization = req.body.specialization,
            founddoctor.appointmentFee = req.body.appointmentFee
            founddoctor.save( (err,saveddoctor) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occurs!!!")
                    res.redirect("indexdoctor")
                }else{
                    console.log("heee")
                    doctor.findByIdAndUpdate(req.user._id, saveddoctor, ( err , updateddoctor ) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occurs!!!")
                            res.redirect("indexdoctor")
                        }else{
                            req.flash("success","Data Updated Successfully!!!")
                            res.redirect("indexdoctor")
                        }
                    } )
                }   
            } )
        }
    } )
}

module.exports = editPersonal