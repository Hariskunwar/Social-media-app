const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPost, getPost, getFeed, getUserPosts, likeUnlikePost, addComment, deleteComment } = require("../controllers/postController");

const router=express.Router();

router.get("/feed",protect,getFeed);
router.get("/user/:id",protect,getUserPosts);
router.post('/',protect,createPost);
router.post("/like/:postId",protect,likeUnlikePost);
router.get("/:id",protect,getPost);
router.post("/comment/:postId",protect,addComment);
router.delete('/comment/:postId/:commentId',protect,deleteComment);

module.exports=router;