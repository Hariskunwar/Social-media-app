const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        maxlength:500
    },
    image:String,
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            commentBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment:{
                type:String,
                required:true
            },
        },
    ],
},{timestamps:true});

module.exports=mongoose.model('Post',postSchema);