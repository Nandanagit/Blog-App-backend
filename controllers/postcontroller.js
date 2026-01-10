const posts=require("../Mongomodels/postModel");


const getPosts=async (req,res)=>{
    try{
        const allposts=await posts.find();
        res.json(allposts);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await posts.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const createPost = async (req, res) => {
  try {
    const totalPosts = await posts.countDocuments();
    const author = req.user && req.user.name ? req.user.name : 'Unknown';
    const createdat = new Date().toISOString();

    const newPost = new posts({
      ...req.body ,
      id: totalPosts + 1,
      author,
      createdat
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPostByAuthor = async (req, res) => {
    try {
        const post = await posts.find({ author: req.params.author });

        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } 
};

const updatePost = async (req, res) => {
    try {
        const post = await posts.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        post.title = req.body.title;
        post.body = req.body.body;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await posts.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  module.exports = { getPosts, getPostById, createPost,getPostByAuthor,updatePost,deletePost };