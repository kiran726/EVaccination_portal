var mongoose = require("mongoose")
var schema = require("./schema")
var doctor = mongoose.model("doctor",schema)

var path = require("path")
var multer = require("multer")
var storage = multer.diskStorage({
    destination : "uploads/profilePics",
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})

var uploads = multer({
    storage : storage,
}).single('image')

function editProfilePic(req,res){
    doctor.findById(req.user._id,function(err,founddoctor){
        if(err){
            console.log(err)
            req.flash("error","Unexpected Error Occured!!!")
            res.redirect("indexdoctor")
        }else{
            uploads(req,res, (err) => {
                if(err){
                    console.log(err)
                    req.flash("error","Unexpected Error Occured!!!")
                    res.redirect("indexdoctor")
                }else{
                    founddoctor.image = req.file.path
                    founddoctor.pictures.unshift(req.file.path)
                    founddoctor.save( (err,saveddoctor) => {
                        if(err){
                            console.log(err)
                            req.flash("error","Unexpected Error Occured!!!")
                            res.redirect("indexdoctor")
                        }else{
                            doctor.findByIdAndUpdate(req.user._id, saveddoctor ,( err, updateddoctor ) => {
                                if(err){
                                    console.log(err)
                                    req.flash("error","Unexpected Error Occured!!!")
                                    res.redirect("indexdoctor")
                                }else{
                                    req.flash("success","Profile Picture Uploaded Successfully!!!")
                                    res.redirect("indexdoctor")
                                }
                            } )
                        }
                    } )
                }
            } )
        }
    })
}
module.exports = editProfilePic