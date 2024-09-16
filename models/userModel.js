const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
    },
    email:{
        type:String,
        required:[true,'Enter your email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Enter password"],
        minlength:[6,'Password should have atleast 6 character']
    },
    profile:String,
    bio:String,
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
       return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})

module.exports=mongoose.model('User',userSchema);