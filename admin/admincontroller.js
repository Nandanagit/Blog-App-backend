const credentials=require("../admin/adminModel");
const {generateToken,verifyToken}=require("../services/tokenService");
const {sendEmail}=require("../services/mailService");
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const register=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user=await credentials.create({name,email,password: hashedPassword});
        res.status(201).json(user);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await credentials.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, role: 'admin' },process.env.JWT_SECRET,{ expiresIn: '1d' }
        
);
console.log(token);
        res.json({user,token});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await credentials.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Generate short-lived reset token
      const resetToken = generateToken({ userId: user._id }, '15m');
  
      // Example: construct password reset link
      const resetLink = ` https://nandana-blog.vercel.app//admin/newpass?token=${resetToken}`;

      const html = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name || ''},</p>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetLink}" style="background:#007bff;color:white;padding:10px 15px;border-radius:5px;text-decoration:none;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Instructions',
      html,
    });
  
      res.json({ message: 'Password reset link sent to email' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        // Verify token and get user
        const decoded = verifyToken(token);
        const user = await credentials.findById(decoded.userId);
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Hash the new password before saving
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();
    
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password reset error:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        res.status(500).json({ message: 'Error updating password' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await credentials.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// User model for admin control
defaultUserModel = require("../Mongomodels/authModel");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await defaultUserModel.find();
        console.log("users",users);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single user by ID
const getUser = async (req, res) => {
    try {
        const user = await defaultUserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = { name, email };
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }
        const user = await defaultUserModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await defaultUserModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Post model for admin control
defaultPostModel = require("../Mongomodels/postModel");

const getPosts=async (req,res)=>{
    try{
        const allposts=await defaultPostModel.find();
        res.json(allposts);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await defaultPostModel.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const createPost = async (req, res) => {
  try {
    const totalPosts = await defaultPostModel.countDocuments();
    const author = req.user && req.user.name ? req.user.name : 'Unknown';
    const createdat = new Date().toISOString();
    const newPost = new defaultPostModel({
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

const deletePost = async (req, res) => {
    try {
        const post = await defaultPostModel.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const updatePost = async (req, res) => {
    try {
        const post = await defaultPostModel.findOne({ id: parseInt(req.params.id) });
        if (!post) return res.status(404).json({ message: "Post not found" });
        post.title = req.body.title;
        post.body = req.body.body;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    register,
    login,
    requestPasswordReset,
    resetPassword,
    getProfile,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
