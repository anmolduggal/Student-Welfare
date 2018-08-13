var express     = require("express"),
    router=express.Router(),
  passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("../models/studentUser"),
     nodemailer = require("nodemailer"),
    Notice       =require("../models/Notice"),
    Complaint=require("../models/Complaint"),
     smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "anmolduggal619@gmail.com",
        pass: "anmol@114307"
    }
}),
     rand,mailOptions,host,link;

router.get("/",isLoggedIn,function(req,res){
	res.render("complaint");
});

router.post("/satisfaction/:id",function(req,res){
        var feedback1;    
    if(req.body.unsatisfied){
    Complaint.findByIdAndUpdate(req.params.id, { $set: { status: 'Pending..',replydate:Date.now() }, $push: {"feedback":{feedbackdata:req.body.feedback,feedbackdate:Date.now()}}}, { new: true }, function (err,complaints) {
    if(err){
            console.log(err)
                req.flash("error","Failed! Please Retry");
                res.redirect("/viewcomplaint");
            }
            else{
                req.flash("Your Feedback has been submited");
                res.redirect("/viewcomplaint");
            }
        });
}
    else{
    Complaint.findByIdAndUpdate(req.params.id, { $set: { isSatisfied:true}}, { new: true }, function (err,complaints) {
        if(err){
            req.flash("error","Failed! Please Retry");
                res.redirect("/viewcomplaint");
        }
        else{
            req.flash("Your Feedback has been submited");
                res.redirect("/viewcomplaint");
        }

    });
    }
});
router.get("/viewcomplaint",isLoggedIn,function(req,res){
    if( req.user.isAdmin== true){
        Complaint.find({status:"Pending.."}).sort([['_id', -1]]).exec(function(err,complaints){
        if(err){
            console.log(err);
        }
        else{
        
            res.render("viewcomplaint",{foundcomplaint:complaints});


        }});
    }
    else if(req.user.isStaff == true){
         Complaint.find({branch:req.user.branch,status:"Pending.."}).sort([['_id', -1]]).exec(function(err,complaints){
        if(err){
            console.log(err);
        }
        else{
        
            res.render("viewcomplaint",{foundcomplaint:complaints});


        }});

    }
    else{
	Complaint.find({userid:req.user._id,isSatisfied:false}).sort([['_id', -1]]).exec(function(err,complaints){
		if(err){
            
			console.log(err);
		}
		else{
           
               
			res.render("viewcomplaint",{foundcomplaint:complaints});

		}
	});}});
router.get("/complainthistory",isLoggedIn,function(req,res){
    if(req.user.isAdmin== true){
        Complaint.find({ status: { $in: [ "Resolved", "Rejected" ]  }}).sort([['_id', -1]]).exec(function(err,complaints){
        if(err){
            console.log(err);
        }
        else{
        
            res.render("viewcomplaint",{foundcomplaint:complaints});


        }});
    }
    else if(req.user.isStaff == true){
         Complaint.find({branch:req.user.branch,status: { $in: [ "Resolved", "Rejected" ]  }}).sort([['_id', -1]]).exec(function(err,complaints){
        if(err){
            console.log(err);
        }
        else{
            
            res.render("viewcomplaint",{foundcomplaint:complaints});


        }});

    }
    else{
    Complaint.find({userid:req.user._id,isSatisfied:true }).sort([['_id', -1]]).exec(function(err,complaints){
        if(err){
            
            console.log(err);
        }
        else{
           
               
            res.render("viewcomplaint",{foundcomplaint:complaints});

        }
    });}});
router.post("/resolve/:id",isLoggedIn,isstaff,function(req,res)
{      
    if(req.body.resolve){
Complaint.findByIdAndUpdate(req.params.id, { $set: { status: 'Resolved',replydate:Date.now() }, $push: {"reply":{replydata:req.body.reply,replydate:Date.now()}}}, { new: true }, function (err,complaints) {
  if (err) 
{console.log(err);
    req.flash("error","Failed");
    res.redirect("/viewcomplaint");
 }
 else{
     req.flash("success","Resolved");
  res.redirect("/viewcomplaint")}
});
}
else{
Complaint.findByIdAndUpdate(req.params.id, { $set: { status: 'Rejected',replydate:Date.now() }, $push: {"reply":{replydata:req.body.reply,replydate:Date.now()}}}, { new: true }, function (err,complaints) {
  if (err) 
{console.log(err);
    req.flash("error","Failed");
    res.redirect("/viewcomplaint");
 }
 else{
     req.flash("success","Rejected");
  res.redirect("/viewcomplaint")}
});
}
});
router.post("/",isLoggedIn,function(req,res)
{	
	var newComplaint = {
		firstname:req.user.firstname,
    	secondname:req.user.secondname,
 		joining_year:req.user.joining_year,
    	roll:req.user.roll,
    	emailid:req.user.emailid,
    	regno:req.user.regno,
    	branch:req.user.branch,
    	complaintType:req.body.complaintType,
    	complaintDesc:req.body.complaintDesc,
        comp1:req.body.comp1,
        comp2:req.body.comp2,
        comp3:req.body.comp3,
    	comp4:req.body.comp4,
        userid:req.user._id,
    	complaint:req.body.basic,
        phone:req.user.phone,
        status:"Pending.."
	}
	Complaint.create(newComplaint,function(err,newCompl){
			if(err){
				console.log(err);
                req.flash("error","Failure! Please retry");
				res.redirect("/hostel");
				
		}
		else{
             req.flash("success","Your Complaint has been submited.");
			res.redirect("/viewcomplaint");
		}

});});
router.get("/viewcomplaint/:id",isLoggedIn,isAdmin,function(req,res){

        Complaint.find({userid:req.params.id}).sort([['_id', -1]]).exec(function(err,foundcomplaints){
            if(err){
                req.flash("error","An error occured");
            console.log(err);
            res.redirect("/home");
        }
        else{
            res.render("viewcomplaint",{foundcomplaint:foundcomplaints});
        }

        });
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
module.exports=router;