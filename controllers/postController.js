const Post=require('../models/postModel');
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError = require('../utils/CustomError');
const User=require("../models/userModel");

exports.createPost=asyncErrorHandler(async (req,res,next)=>{
    req.body.postedBy=req.user._id;
    const post=await Post.create(req.body);
    res.status(201).json({
        data:post
    });
});


//retrive single post
exports.getPost=asyncErrorHandler(async (req,res,next)=>{
    const post=await Post.findById(req.params.id);
    if(!post){
        return next(new CustomError('Post not found',404));
    }
    res.status(200).json({
        data:post
    });
});

//get posts of user followings
exports.getFeed=asyncErrorHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id);
    const posts=await Post.find({postedBy:{$in:user.followings}}).sort({createdAt:-1});
    res.status(200).json({
        data:posts
    });
});

//get user all post
exports.getUserPosts=asyncErrorHandler(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new CustomError("User not found",404));
    }
    const posts=await Post.find({postedBy:user._id}).sort({createdAt:-1});
    res.status(200).json({
        data:posts
    });
});