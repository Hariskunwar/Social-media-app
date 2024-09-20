const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPost, getPost, getFeed, getUserPosts } = require("../controllers/postController");

const router=express.Router();

router.get("/feed",protect,getFeed);
router.get("/user/:id",protect,getUserPosts);
router.post('/',protect,createPost);
router.get("/:id",protect,getPost);

module.exports=router;