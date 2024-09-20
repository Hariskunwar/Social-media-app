const express=require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPost, getPost, getFeed } = require("../controllers/postController");

const router=express.Router();

router.get("/feed",protect,getFeed);
router.post('/',protect,createPost);
router.get("/:id",protect,getPost);

module.exports=router;