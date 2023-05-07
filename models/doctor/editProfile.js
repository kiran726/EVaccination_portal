var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

editProfile = (req,res) => {
    doctor.findById(req.user._id, (err,founddoctor) => {
        if(err){
            console.log(err)
            res.redirect("/signindoctor")
        }else{
            res.render("doctor/editProfile", { doctor : founddoctor } )
        }
    } )
}

module.exports = editProfile