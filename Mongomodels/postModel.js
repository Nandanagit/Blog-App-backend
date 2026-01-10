const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
    id:Number,
    title:String,
    body:String,
    author:String,
    createdat:String
})
module.exports=mongoose.model("Post",postSchema);
