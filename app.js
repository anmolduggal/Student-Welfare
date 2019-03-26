const express     = require("express"),
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
     gmailNode = require('gmail-node');

     const clientSecret = {installed:{
        client_id:"133586172988-mluc0qbict30ok3rmrrdbla1mv9df433.apps.googleusercontent.com",
        project_id:"inc-ognito",
        auth_uri:"https://accounts.google.com/o/oauth2/auth",
        token_uri:"https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
        client_secret:"__DNkR9rqfgeB3sZz-NH8fW7",
        redirect_uris:["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};
        gmailNode.init(clientSecret, './token.json', function(err,data){ });

var options = { server: { socketOptions: { keepAlive: 1 } } };
var connectionString = 'mongodb://admin:anmol@duggal@localhost:27017/myDB';

mongoose.connect('mongodb://mnnit:KXiMsv8GpvW3cui@ds147965.mlab.com:47965/studentwelfare',{useNewUrlParser:true});


//Add those events to get more info about mongoose connection:

// Connected handler
mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB using chain: " + connectionString);
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
//    self.connectToDatabase();
mongoose.connect('mongodb://mnnit:KXiMsv8GpvW3cui@ds147965.mlab.com:47965/studentwelfare',{useNewUrlParser:true});

});
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