var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

deleteSomeInfo = (req,res) => {
    doctor.findById(req.user._id, (err, founddoctor) => {
        if(err){
            console.log(err)
            req.flash("error","UNEXPECTED ERROR OCCURED!!!")
            res.redirect("indexdoctor")
        }else{
            var list = founddoctor.experience
            var newList = list.slice(0,req.params.index)
            newList = newList.concat(list.slice(( req.params.index) + 1,list.length))
            founddoctor.experience = newList
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
                            req.flash("success","DATA UPDATED SUCCESSFULLY!!!")
                            res.redirect("profiledoctor")
                        }
                    } )
                }
            } )
        }
    } )
}

module.exports = deleteSomeInfo