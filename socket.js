
const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const cookie=require("cookie");
const jwt=require("jsonwebtoken");
const User=require("./models/userModel");
const CustomError=require("./utils/CustomError");


const app=express();
const server=http.createServer(app);

const io=new Server(server);

//middleware to parse socket cookie
const parseSocketCookieHeader=async (socket,next)=>{
    try {
        const cookieHeader=socket.handshake.headers.cookie;
        if(!cookieHeader){
            return next(new CustomError("no cookie provided",400))
        }
        const cookies=cookie.parse(cookieHeader);
        const token=cookies.jwt;
        if(!token){
            return next(new CustomError("token not provided",400));
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return next(new CustomError("Invalid token",401));
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return next(new CustomError("user not found",404));
        }
        socket.user=user;
        next();
    } catch (error) {
            return next(new CustomError("Internal server error",500));
    }
}

const getRecieverSocketId=(recieverId)=>{
    return userSocketMap[recieverId];
}
const userSocketMap={};

//use parseSocketCookieHeader middleware
io.use((socket,next)=>{
    parseSocketCookieHeader(socket,next);
});

io.on('connection',(socket)=>{
    console.log("a user connected",socket.user._id);
    let userId=socket.user._id;
    if(userId!=="undefined") userSocketMap[userId]=socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on('disconnect',()=>{
        console.log("a user disconnected",socket.user._id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
});

module.exports={app,server,io,getRecieverSocketId};
