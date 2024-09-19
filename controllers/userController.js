const User=require('../models/userModel');
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');

const generateToken=(id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    });
};


//user sign up
exports.signup=asyncErrorHandler(async (req,res,next)=>{
        let user=await User.findOne({email:req.body.email});
        if(user){
            return next(new CustomError("User with this already exists",400));
        }
        user=await User.create(req.body);
        res.status(201).json({
            user,
            token:generateToken(user._id)
        })
    })

    //user login
    exports.login=asyncErrorHandler(async (req,res,next)=>{
        const {email,password}=req.body;
        if(!email||!password){
            return next(new CustomError('Provide email and password',400));
        }
        const user=await User.findOne({email}).select("+password");
        if(!user||!(await user.comparePassword(password,user.password))){
            return next(new CustomError("Incorrect email or password",400));
        }
        delete user._doc.password;
        res.status(200).json({
            data:user,
            token:generateToken(user._id)
        });
    });

    exports.getUserProfile=asyncErrorHandler(async (req,res,next)=>{
        const user=await User.findById(req.params.userId);
        if(!user){
            return next(new CustomError('User not found',404));
        }
        res.status(200).json({
            data:user
        });
    });


    //follow and unfollow user
    exports.followUnfollowUser=asyncErrorHandler(async (req,res,next)=>{
        const {id}=req.params;
        const loggedInUser=await User.findById(req.user._id);
        const userToFollow=await User.findById(id);
        if(!userToFollow){
            return next(new CustomError("User not found",404));
        }
        if(id===req.user._id.toString()){
            return next(new CustomError("you cannot follow yourself",400));
        }
        //if already followed then unfollow
        if(loggedInUser.followings.includes(id)){
            await User.findByIdAndUpdate(req.user._id,{$pull:{followings:id}});
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            res.status(200).json({
                message:"User unfollowed successfully"
            });
        }
        //follow the user
        else{
            await User.findByIdAndUpdate(req.user._id,{$push:{followings:id}});
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            res.status(200).json({
                message:"User followed successfully"
            });
        }
    });