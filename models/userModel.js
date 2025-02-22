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
        minlength:[6,'Password should have atleast 6 character'],
        select:false
    },
    profile:String,
    bio:String,
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
       return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword=async function(userEnterPassword,dbPassword){
    return bcrypt.compare(userEnterPassword,dbPassword);
}

module.exports=mongoose.model('User',userSchema);