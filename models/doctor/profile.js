var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

profile = (req,res) => {
    doctor.findById(req.user._id, (err,founddoctor) => {
        if(err){
            console.log(err)
            res.redirect("/signindoctor")
        }else{
            res.render("doctor/profile", { doctor : founddoctor } )
        }
    } )
}

module.exports = profile