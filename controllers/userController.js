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
