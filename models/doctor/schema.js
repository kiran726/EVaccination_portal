var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var doctorSchema = new mongoose.Schema({
    username : String,
    password : String,
    email : String,
    image : String,
    patients : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Child"
        }
    ],
    specialization : String,
    address : String,
    country : String,
    pinCode : String,
    AvailableOn: Date,
    AvailableFor:String,
    alternateContact : String,
    mobileNumber : String,
    Time : String,
    joined : Date,
    FacebookUrl: String,
    TwitterUrl: String,
    InstagramUrl: String,
    LinkedinUrl: String,
    completedVaccinations : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Vaccine"
    }],
    appointmentFee : String,
    age : String,
    pictures : [ String ],
    fname : String,
    lname : String,
    city : String,
    dob : String,
    state : String,
    education : [{
        year : String,
        degree : String,
        institute : String,
        result : String
    }],
    experience : [{
        year : String,
        department : String,
        position : String,
        hospital : String,
        feedback : String
    }],
    notifications : [{
        what : String,
        when : String,
        image : String
    }]
})

doctorSchema.plugin(passportLocalMongoose)

module.exports = doctorSchema