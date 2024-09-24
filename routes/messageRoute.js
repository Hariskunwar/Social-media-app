const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { sendMessage, getMessages } = require("../controllers/messageController");

const router=express.Router();

router.post("/:reciverId",protect,sendMessage);
router.get("/:chatWithId",protect,getMessages);

module.exports=router;