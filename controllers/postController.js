const Post=require('../models/postModel');
const asyncErrorHandler=require("../utils/asyncErrorHandler");


exports.createPost=asyncErrorHandler(async (req,res,next)=>{
    req.body.postedBy=req.user._id;
    const post=await Post.create(req.body);
    res.status(201).json({
        data:post
    });
});