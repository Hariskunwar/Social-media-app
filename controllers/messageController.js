const Message=require("../models/messageModel");
const Conversation=require("../models/conversationModel");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const { io , getRecieverSocketId } = require("../socket");

exports.sendMessage=asyncErrorHandler(async (req,res,next)=>{
    const {message}=req.body;
    const senderId=req.user._id;
    const {reciverId}=req.params;
    let conversation=await Conversation.findOne({
        participants:{$all:[senderId,reciverId]}
    });
    if(!conversation){
        conversation=await Conversation.create({
            participants:[senderId,reciverId]
        });
    }
    const newMessage=new Message({
        senderId:senderId,
        reciverId:reciverId,
        message:message
    });
    if(newMessage){
        conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(),newMessage.save()]);
    
    const recieverSocketId=getRecieverSocketId(reciverId);
    if(recieverSocketId){
        io.to(recieverSocketId).emit('newMessage',newMessage);
    }
    res.status(200).json({
        data:newMessage
    })
});

//get all chat between two users
exports.getMessages=asyncErrorHandler(async (req,res,next)=>{
    const {chatWithId}=req.params;
    const senderId=req.user._id;
    const conversation=await Conversation.findOne({
        participants:{$all:[senderId,chatWithId]}
    }).populate("messages")
    if(!conversation){
        return res.status(200).json([]);
    }
    const messages=conversation.messages;
    res.status(200).json({
        data:messages
    });
});