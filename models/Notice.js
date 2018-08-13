var mongoose = require("mongoose");


var NoticeSchema = new mongoose.Schema({
    username: String,
    firstname:String,
    secondname:String,
    password: String,
    roll:String,
    emailid:String,
    regno:String,
    branch:String,
    noticeType:String,
    noticeDesc:String,
    userid:{
    	type: mongoose.Schema.Types.ObjectId,
    	ref:"User"
    },
    pdf:{type: String,required:true},
    forAll:{type: Boolean, default:false },
    date:{ type: Date , default:Date.now},


});


module.exports = mongoose.model("Notice", NoticeSchema);