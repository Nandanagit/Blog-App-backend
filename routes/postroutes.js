const express=require("express");
const router=express.Router();
const { getPosts, getPostById,getPostByAuthor,updatePost,deletePost } = require('../controllers/postcontroller');
const { createPost } = require('../controllers/postcontroller');
const authenticateJWT = require('../services/authMiddleware');

router.get("/", getPosts);
router.get("/id/:id", getPostById);
router.post("/", authenticateJWT, createPost);
router.get("/author/:author", authenticateJWT, getPostByAuthor);
router.post("/update/:id", authenticateJWT, updatePost);
router.delete("/delete/:id", authenticateJWT, deletePost);
router.get("/postss", getPosts);
module.exports=router;