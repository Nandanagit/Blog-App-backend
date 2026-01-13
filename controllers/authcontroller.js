const credentials=require("../Mongomodels/authModel");
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
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email },process.env.JWT_SECRET,{ expiresIn: '24h' }
);
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
      const resetLink = ` https://blog-app-bynandana.vercel.app/auth/newpass?token=${resetToken}`;

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

module.exports={register,login,requestPasswordReset,resetPassword,getProfile};
