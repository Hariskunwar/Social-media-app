require("dotenv").config({path:"config/config.env"});
const app=require("./app");
const database=require('./config/database');

database();


const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log(`Server listening on port : ${port}`);
})