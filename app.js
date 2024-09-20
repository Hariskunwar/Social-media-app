const express=require("express");
const CustomError=require("./utils/CustomError");
const errorHandler=require("./middlewares/errorHandler");

const app=express();

app.use(express.json());

app.use('/api/v1/users',require("./routes/userRoute"));
app.use("/api/v1/posts",require('./routes/postRoute'));

//default route
app.all("*",(req,res,next)=>{
   const err=new CustomError(`${req.originalUrl} not found`,404);
   next(err);
})

app.use(errorHandler);

module.exports=app;