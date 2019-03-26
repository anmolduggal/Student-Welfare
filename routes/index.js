var express     = require("express"),
    router=express.Router(),
  passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("../models/studentUser"),
     nodemailer = require("nodemailer"),
    Notice       =require("../models/Notice");
     var gmailNode = require('gmail-node');
var clientSecret = {installed:{
    client_id:"133586172988-mluc0qbict30ok3rmrrdbla1mv9df433.apps.googleusercontent.com",
    project_id:"inc-ognito",
    auth_uri:"https://accounts.google.com/o/oauth2/auth",
    token_uri:"https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
    client_secret:"__DNkR9rqfgeB3sZz-NH8fW7",
    redirect_uris:["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};
    gmailNode.init(clientSecret, './token.json', function(err,data){ });

router.post("/login",isnotLoggedIn,passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome!',
        session:true
    }), function(req, res){
});
router.get("/staffsignup",isLoggedIn,isAdmin,function(req,res){
    res.render("staffsignup");
}); 
router.post("/staffsignup",isnotLoggedIn,function(req,res){
rand=Math.floor((Math.random() * 10000) + 54);
var newUser = new User({username: req.body.emailid,
    firstname:req.body.fname,
    secondname:req.body.sname,
    joining_year:req.body.year,
    roll:req.body.roll,
    emailid:req.body.emailid,
    regno:req.body.regno,
    branch:req.body.branch,
    isStaff:true,
    phone:req.body.phone,
    verifycode:rand

});

   if(req.body.adminId){
        if(req.body.adminId==123456)
{
        newUser.isAdmin=true;
        User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error","Emailid,RollNo or Regno is already registered");
            return res.redirct("/staffsignup");
        }
        else{
            verificationMail(rand,req.body.emailid,req,res);

      }});  
    
}
    else{
        req.flash("error","Enter A valid Admin Id");
        res.redirect("/staffsignup");
    }}
else{

User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error","Emailid,RollNo or Regno is already registered")
            return res.render("signup");
        }
       else{
        verificationMail(rand,req.body.emailid,req,res);
 
      }});  
    } });


router.get('/verify',isnotLoggedIn,function(req,res){
    res.render("verify");
});
router.post('/verify',isnotLoggedIn,function(req,res){
  User.findOne({emailid:req.body.email},function(err,found){
    if(err){
        console.log(err);
        req.flash("error","Please Signup First");
        res.redirect("/login");
    }
    else{
      if(found!=null&&found.isVerified==false){
        if(req.body.verify==found.verifycode){
            console.log("ture");
            User.findOneAndUpdate({emailid:req.body.email},{$set:{isVerified:true},$unset:{verifycode:1}},function(err,founduser){
            if(err)
            {
                console.log(err);
                req.flash("error","Email "+founduser.emailid+" verification failed");
            }
            else{
                req.flash("success","Email "+founduser.emailid+" has been Successfully verified");
                res.redirect("/login");
            }           
        });}
        else{
            console.log(err);
              req.flash("error","Wrong code");
            res.redirect("/verify");
       } }
        else{
            req.flash("error","Your Account is already verified Please login");
            res.redirect("/login");
        }
    }
  });
  //
       // 
        //res.redirect("/login");    
        //});
    });

router.post("/signup",isnotLoggedIn,function(req,res){
rand=Math.floor((Math.random() * 10000) + 54);
var newUser = new User({username: req.body.emailid,
    firstname:req.body.fname,
    secondname:req.body.sname,
    joining_year:req.body.year,
    roll:req.body.roll,
    emailid:req.body.emailid,
    regno:req.body.regno,
    room:req.body.room,
    phone:req.body.phone,
    branch:req.body.branch,
    verifycode:rand
});
User.register(newUser, req.body.password, function(err, user){
        if(err){

            console.log(err);
            req.flash("error","Emailid,RollNo or Regno is already registered");
            return res.redirect("/signup");
        }
        else{
            
            verificationMail(rand,req.body.emailid,req,res);
        
        }
   });});

router.get("/welcome",isnotLoggedIn,function(req,res){
    Notice.find({forAll:true}).sort([['_id', -1]]).exec(function(err,foundNotices){
        if(err){
            console.log(err);
            res.redirect("/welcome");
        }
        else{     
        res.render("welcome",{notices:foundNotices});
    }
});
});
router.get("/user/:id",isLoggedIn,function(req,res){
    if(req.params.id==req.user._id ||req.user.isAdmin==true){
    User.findById(req.params.id,function(err,founduser){
        if(err){
            req.flash("error","An error occured");
            console.log(err);
            res.redirect("/home");
        }
        else{
        res.render("user",{user:founduser});
    }});}
    else{
        req.flash("error","Error");
        res.redirect("/home");
    }
});
router.get("/",isnotLoggedIn,function(req,res){
    res.redirect("/welcome");
});
router.get("/search",isLoggedIn,isAdmin,function(req,res){
 if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       User.find({$or:[{firstname:regex},{secondname:regex},{emailid:regex},{branch:regex},{regno:regex},{roll:regex}]}, function(err, foundusers) {
           if(err) {
               console.log(err);
           } else {
            if(foundusers.length!=0){
              res.render("search", { users: foundusers,heading:"Found"});
            }
            else{
                res.render("search",{users:foundusers,heading:"Not Found"});
            }
           }
       }); 
    }
});
 router.post("/delete/:id",isLoggedIn,isAdmin,function(req,res){

        User.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            req.flash("error","ERROR Please Retry");
            res.redirect("/user/req.params.id");
        }
        else{
            req.flash("success","User has been removed successfully");
            res.redirect("/home");
        }

    });
    });
router.get("/changepassword",isLoggedIn,function(req,res){
    res.render("changepass");
});
router.post("/changepassword",isLoggedIn,function(req,res){
    User.findById(req.user._id,function(err,founduser){
        if(err){
            req.flash("error","Error");
            res.redirect("/home");
        }
        else{
            founduser.changePassword(req.body.oldpass,req.body.newpass,function(err){
                if(err){
                    req.flash("error","Failed");
                    req.flash("error","Failed");
                    res.redirect("/changepassword");
                }
                else{
                    req.flash("success","Password Changed");
                    res.redirect("/changepassword");

                        
                }
            });
        }
    });

});
router.get("/signup",isnotLoggedIn,function(req,res){
    res.render("signup");
});

router.get("/home",isLoggedIn,function(req,res){
    res.render("home");
});
// show login form
router.get("/login",isnotLoggedIn,function(req, res, next){
  res.render("login");

});
router.get("/logout",isLoggedIn,function(req,res){
    req.logout();
    req.session.passport.user = null
   req.flash("success","You have been successfully Logout");
    
    
    res.redirect("/login");
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
        res.redirect("/verify");
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
function verificationMail(rand,email,req,res){
    let host=req.get('host');
    let link="http://"+req.get('host')+"/verify";
    var emailMessage ={
    to : email,
    subject : "Please confirm your Email account",
    message : "Hello,<br>Welcome to Incog<br>Your Verification Code is<br><h2><strong>"+rand +"</strong></h2><br><a href='"+link+"'>Verification Page</a>" 
        }
 gmailNode.sendHTML(emailMessage, function (err, data){
    if(err){
        console.log(err);
        req.flash("error","Contact Support ");
        res.redirect("/");
    }
    req.flash("success","You are signed up. A Verification Email has been sent to you! ");
    res.redirect("/verify");
    });
}
module.exports=router;