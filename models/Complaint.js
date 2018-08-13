var mongoose = require("mongoose");


var ComplaintSchema = new mongoose.Schema({
  username: String,
    firstname:String,
    secondname:String,
    joining_year:Number,
    roll:String,
    emailid:String,
    regno:Number,
    branch:String,
    complaintType:String,
    complaintSubtype:String,
    complaintDesc:String,
    comp1:String,
    comp2:String,
    comp3:String,
    comp4:String,
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    room:String,
    phone:String,
    complaint:String,
    status:String,
    date:{ type:Date, default:Date.now},
    reply:[{replydata:{type:String,default:null},replydate:Date}],
    feedback:[{feedbackdata:{type:String,default:null},feedbackdate:Date}],
    isSatisfied:{type:Boolean,default:false}
});



module.exports = mongoose.model("Complaint", ComplaintSchema);