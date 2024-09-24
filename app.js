require("dotenv").config({path:"config/config.env"});
const express=require("express");
const {app,server}=require("./socket");
const CustomError=require("./utils/CustomError");
const errorHandler=require("./middlewares/errorHandler");

const database=require('./config/database');

database();

app.use(express.json());

app.use('/api/v1/users',require("./routes/userRoute"));
app.use("/api/v1/posts",require('./routes/postRoute'));
app.use("/api/v1/messages",require("./routes/messageRoute"))
//default route
app.all("*",(req,res,next)=>{
   const err=new CustomError(`${req.originalUrl} not found`,404);
   next(err);
})

app.use(errorHandler);

const port=process.env.PORT||4000;
server.listen(port,()=>{
    console.log(`Server listening on port : ${port}`);
});

