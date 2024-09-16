const mongoose=require("mongoose");

module.exports=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected : ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
    }
}

