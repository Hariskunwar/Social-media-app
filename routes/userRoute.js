const express=require("express");
const { signup, login, getUserProfile, followUnfollowUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router=express.Router();

router.post('/',signup);
router.post('/login',login);
router.get("/:userId",protect,getUserProfile);
router.post("/follow-unfollow/:id",protect,followUnfollowUser);

module.exports=router;