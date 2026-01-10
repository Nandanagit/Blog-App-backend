const mongoose=require("mongoose");
const adminSchema=new mongoose.Schema({
    id:Number,
    name:String,
    email:String,
    password:String,
    createdat:{type:Date,default:Date.now}
})
module.exports=mongoose.model("Admin",adminSchema);