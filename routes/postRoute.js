const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPost } = require("../controllers/postController");

const router=express.Router();

router.post('/',protect,createPost);

module.exports=router;