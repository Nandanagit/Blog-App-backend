const express=require("express");
const router=express.Router();
const { getPosts, getPostById } = require('../controllers/postcontroller');
const { createPost } = require('../controllers/postcontroller');
const authenticateJWT = require('../services/authMiddleware');

router.get("/",getPosts);
router.get("/:id",getPostById);
router.post("/", authenticateJWT, createPost);

module.exports=router;