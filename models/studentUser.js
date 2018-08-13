var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    firstname:String,
    secondname:String,
    password: String,
    joining_year:Number,
    isStaff:{type: Boolean, default:false},
    isAdmin:{type:Boolean,default:false},
    roll:{type:String,required:true,index:{unique:true}},
    emailid:{type:String,required:true,index: { unique: true }},
    regno:String,
    branch:String,
    isVerified:{type:Boolean,default:false},
    room:String,
    phone:String,
    verifycode:Number
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);