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
      ...req.body,
      id: totalPosts + 1,
      createdat
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
  
  module.exports = { getPosts, getPostById, createPost };