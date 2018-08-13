var express     = require("express"),
    multer = require('multer'),
    router=express.Router(),
    Notice       =require("../models/Notice");


const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='application/pdf')
    {cb(null,true); 
    }
    else{
        cb(null,false);
    }
};
const storages= multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'public/uploads');
    },
    filename:function(req,file,cb) {
         cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname)
    }
});
var upload= multer(
    {storage:storages,
       limits: {
            fileSize:1024*1024 *15
        },
        fileFilter:fileFilter


    });

router.get("/submitnotice",isLoggedIn,isstaff,function(req,res){
    res.render("submitnotice");
});
router.post("/submitnotice",isLoggedIn,isstaff,upload.single('file'),function(req,res){
    
    if(req.body.noticeType=="Notice Type"){
        req.flash("Please select a notice type");
        res.redirect("/submitnotice");
    }
    else{
    var newNotice = {
        firstname:req.user.firstname,
        secondname:req.user.secondname,
        roll:req.user.roll,
        emailid:req.user.emailid,
        regno:req.user.regno,
        branch:req.user.branch,
        noticeType:req.body.noticeType,
        noticeDesc:req.body.noticeDesc,
        userid:req.user._id,
        pdf:req.file.filename
            }
            if(req.body.forAll=="on"){
                newNotice.forAll=true;
            }
        Notice.create(newNotice,function(err,newCompl){
            if(err){
                console.log(err);
                req.flash("error","Failure! Please retry");
                res.redirect("/submitnotice");
                
        }
        else{
             req.flash("success","Notice has been submited.");
            res.redirect("/home");
        }

});
    
}});
router.post("/:id",isLoggedIn,isstaff,function(req,res){
    Notice.findById(req.params.id,function(err,notice){
        if(notice.userid.equals(req.user._id) || req.user.isAdmin==true){

    Notice.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            req.flash("error","ERROR Please Retry");
            res.redirect("/home");
        }
        else{
            req.flash("success","Notice has been deleted successfully");
            res.redirect("/home");
        }

    });
}
    else{
        req.flash("error","You are not allowed to Delete it");
        res.redirect("/home");
    }
});
});
router.get("/general",isLoggedIn,function(req,res){
    Notice.find({forAll:true}).sort([['_id', -1]]).exec(function(err,foundNotices){
        if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
            
            
        res.render("notice",{notices:foundNotices,heading:"General Notice"});
    }
});});
router.get("/hnotice",isLoggedIn,function(req,res){

    if(req.user.isAdmin==false)
    {
    Notice.find({noticeType:"Hostel Notice",branch:req.user.branch}).sort([['_id', -1]]).exec(function(err,foundNotices){
        if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
            
            
        res.render("notice",{notices:foundNotices,heading:"Hostel Notice"});
    }

    });}
       else {
        Notice.find({noticeType:"Hostel Notice"}).sort([['_id', -1]]).exec(function(err,foundNotices)
        {
            if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
        res.render("notice",{notices:foundNotices,heading:"Hostel Notice"});
    }
        });
    }

});
router.get("/anotice",isLoggedIn,function(req,res){

    if(req.user.isAdmin==false)
    {
    Notice.find({noticeType:"Academic Notice",branch:req.user.branch}).sort([['_id', -1]]).exec(function(err,foundNotices){
        if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
         
            
        res.render("notice",{notices:foundNotices,heading:"Academic Notice"});
    }

    });}
    else {
        Notice.find({noticeType:"Academic Notice"}).sort([['_id', -1]]).exec(function(err,foundNotices)
        {
            if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
        res.render("notice",{notices:foundNotices,heading:"Academic Notice"});
    }
        });
    }

});

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
module.exports=router;