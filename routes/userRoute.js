const express=require("express");
const { signup, login } = require("../controllers/userController");

const router=express.Router();

router.post('/',signup);
router.post('/login',login);

module.exports=router;