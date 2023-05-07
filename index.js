var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

var passport = require("passport")
var LocalStratergy = require("passport-local")

var nodemailer = require("nodemailer")
var methodOverride = require("method-override")

var flash =  require("connect-flash")
var session = require('express-session');
require("dotenv").config()

var app = express();
// 
mongoose.connect(process.env.DB_URL_PRODUCTION ,  { useUnifiedTopology: true,useNewUrlParser : true })

//models
var doctorSchema = require("./models/doctor/schema")
var doctor = mongoose.model("doctor",doctorSchema)
var parentSchema = require("./models/parent/schema")
var Parent = mongoose.model("Parent",parentSchema)

//test
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')
AdminJS.registerAdapter(AdminJSMongoose)

const adminJs = new AdminJS({
  databases: [],
  rootPath: '/admin',
})

const adminRouter = AdminJSExpress.buildRouter(adminJs)

app.use(adminJs.options.rootPath, adminRouter)
app.listen(8080, () => console.log('AdminJS is under localhost:8080/admin'))

//parent routes
var parentRoutes = require("./routes/parent")
//child routes
var childRoutes = require("./routes/child")
//appoinment routes
var appoinmentRoutes = require("./routes/appointment")
//doctor routes
var doctorRoutes = require("./routes/doctor")
//otp routes
var otpRoutes = require("./routes/otp")
//news routes
var newsRoutes= require("./routes/news")
//dummy credentials
var schema = require("./models/dummy/schema")
var MailedTo = mongoose.model("MailedTo",schema)

app.use(bodyParser.urlencoded({extended : true}))
app.set("view engine","ejs")
app.use('/uploads',express.static("uploads"))
app.use(express.static("public"))
app.use(methodOverride("_method"));

app.use(session({
    secret : "Vaccination",
    resave : false,
    saveUninitialized : false
}))

app.use(flash());
app.use(function(req,res,next){
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use(passport.initialize())
app.use(passport.session())

passport.use("doctor" ,new LocalStratergy(doctor.authenticate()))
passport.use("parent" ,new LocalStratergy(Parent.authenticate()))

passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    if(user!=null)
        done(null,user);
});

app.get("/",function(req,res){
    res.render("home")
})


app.get("/dummyCredential",(req,res) => {
    res.render("dummyCredential",{ page : "Dummy Credential" })
} )

app.post("/dummyCredential",async (req,res) => {
    try {
        var {enteredName,enteredEmail} = req.body
        var newUser = await MailedTo.create({ name : enteredName,  email : enteredEmail })
        const smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.PASSWORD
            }
        })
        const mailOpts = {
            from: "E - Vaccination",
            to: enteredEmail,
            subject: 'Dummy Credentials for E - Vaccination',
            text: "Hi," + enteredName + "\n\n" + 
            "To proceed further with E - Vaccination , you can use following credentials."
            + "\n\n" + 
            "Parent Credentials : \nUsername - Dummy Parent\nPassword - dummypassword"
            + "\n\n" + 
            "doctor Credentials : \nUsername - Dummy doctor\nPassword - dummypassword"
            + "\n\n" + 
            "Regards,\n" +
            "Team ,E - Vaccination"
        }
        var response = await smtpTrans.sendMail(mailOpts)
        req.flash("success","Dummy Credentials has been sent to you! Please check your email")
        res.redirect("signindoctor")
    } catch (error) {
        console.log(error)
        req.flash("error","Cannot send you credentials right now")
        res.redirect("signindoctor")
    }
} )

app.use(doctorRoutes)
app.use(parentRoutes)
app.use(childRoutes)
app.use(appoinmentRoutes)
app.use(otpRoutes)
app.use(newsRoutes)



app.get("/wrongCredentials-:role", (req, res) => {
    req.flash("error","WRONG USERNAME OR PASSWORD")
    res.redirect("/signin" + req.params.role )
} )

app.get("/logout-:role",(req,res)=>{
    req.flash("success","YOU HAVE BEEN LOGGED OUT")
    req.logout()
    res.redirect("signin" + req.params.role)
})

app.get("/*",(req,res) => {
    res.render("404error")
})

app.listen(process.env.PORT || 5000,function(){
    console.log("SERVER AT 5000")
})