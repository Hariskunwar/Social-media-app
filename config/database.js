const mongoose=require("mongoose");

module.exports=async ()=>{
    try {
        const conn=await mongoose.connect('mongodb://127.0.0.1:27017/social-media');
        console.log(`Database connected : ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
    }
}

