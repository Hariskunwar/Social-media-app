const express=require("express");
const { signup, login, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/',signup);
router.post('/login',login);
router.get("/:userId",protect,getUserProfile);

module.exports=router;