const User=require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const jwt=require("jsonwebtoken");
const util=require("util");

exports.protect=asyncErrorHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new CustomError("You are not logged in",401));
    }
    const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.id);
    if(!user){
        return next(new CustomError("Invalid token",401));
    }
    req.user=user;
    next();
})