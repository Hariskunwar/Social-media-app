const User=require('../models/userModel');
const jwt=require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    });
};


//user sign up
exports.signup=async (req,res)=>{
    try {
        let user=await User.findOne({email:req.body.email});
        if(user){
          return res.status(400).json({
                msg:"User with this already exists"
            });
        }
        user=await User.create(req.body);
        res.status(201).json({
            user,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            msg:error.message
        });
    }
};
