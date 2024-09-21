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

//post like and unlike functionality
exports.likeUnlikePost=asyncErrorHandler(async (req,res,next)=>{
    const {postId}=req.params;
    const userId=req.user._id;
    const post=await Post.findById(postId);
    if(!post){
        return next(new CustomError("Post not found",404));
    }
    //if user already liked post then remove like
    if(post.likes.includes(userId)){
        await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}});
        res.status(200).json({
            message:"post unliked successfully"
        })
    }else{
        await Post.findByIdAndUpdate(postId,{$push:{likes:userId}});
        res.status(200).json({
            message:"post liked successfully" 
         })
    }
});

//comment on post
exports.addComment=asyncErrorHandler(async (req,res,next)=>{
    const {postId}=req.params;
    const {comment}=req.body;
    let post=await Post.findById(postId);
    if(!post){
        return next(new CustomError("Post not found",404));
    }
    post=await Post.findByIdAndUpdate(postId,{$push:{comments:{
        commentBy:req.user._id,
        comment:comment
    }}},{new:true});
    res.status(200).json({
        message:"comment added successfully",
        data:post
    });
});

//delete a comment
exports.deleteComment=asyncErrorHandler(async (req,res,next)=>{
    const {postId,commentId}=req.params;
    const post=await Post.findById(postId);
    if(!post){
        return next(new CustomError("Post not found",404));
    }
    const commentIndex=post.comments.findIndex((comment)=>{
        return comment._id.toString()===commentId.toString();
    });
    if(commentIndex===-1){
        return next(new CustomError("Comment not found",404));
    }
    //only post owner and comment owner can delete comment
    if(
        post.postedBy.toString()===req.user._id.toString()||
        post.comments[commentIndex].commentBy.toString()===req.user._id.toString()
    ){
        await Post.findByIdAndUpdate(postId,{$pull:{comments:{_id:commentId}}});
        res.status(200).json({
            message:"comment deleted successfully"
        })
    }else{
        next(new CustomError("You are not authorized to delete this comment",401));
    }
});

//delete post
exports.deletePost=asyncErrorHandler(async (req,res,next)=>{
    const post=await Post.findById(req.params.id);
    if(!post){
        return next(new CustomError("Post not found",404));
    }
    //only post owner can delete post
    if(post.postedBy.toString()!==req.user._id.toString()){
        return next(new CustomError("Unauthorized to delete post",401))
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
        message:'post delete successfully'
    });
});