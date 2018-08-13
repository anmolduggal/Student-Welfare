var express     = require("express"),
    flash       = require("connect-flash"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/studentUser"),
    Notice       =require("./models/Notice"),
    Complaint=require("./models/Complaint"),
    cookieParser = require('cookie-parser'),
    multer = require('multer');
mongoose.connect("mongodb://localhost/mnnit");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var notice=require("./routes/notice"),
    index=require("./routes/index"),
    complaint=require("./routes/complaint");
app.use(require("express-session")({
    secret: "Made by Anmol Duggal",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next){ res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cookieParser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/",index);
app.use("/notice",notice);
app.use("/complaint",complaint);
app.get("*",function(req,res){
    req.flash("error","Page Does not Exist!");
    res.redirect("/welcome");
});
app.listen(3000,function(){
	console.log("server has started");
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
if(req.user.isVerified==true) {
        return next();
    }
    else{
        req.logout();
        req.session.passport.user = null;
        req.flash("error","Please verify acc first");
        res.redirect("/login");
    }
}
    else{
    req.flash("error","Please Login First");
    res.redirect("/welcome");
}}
function isnotLoggedIn(req, res, next){
    if(req.user && req.isAuthenticated())
    {
        res.redirect("/home");
    }
    else{
             return next();
    }
}
function isstaff(req,res,next){
    if(req.isAuthenticated() && req.user.isStaff==true)
    {
        return next();
    }
    else{
        req.flash("error","You are not Permitted");
        res.redirect("/home");
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function isAdmin(req,res,next){
    if(req.isAuthenticated && req.user.isAdmin==true)
    {
        return next();
    }
    else{
        req.flash("error","You are nor Permitted");
        res.redirect("/home");
    }
}