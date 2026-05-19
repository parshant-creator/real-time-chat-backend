const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (req, res)=>{
    try{
        const {username, email, password, phone} =  req.body;
        if(!username || !email || !password || !phone){
            return res.status(400).json({msg: "Please provide all the fields"});
        }
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({msg: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user  = await User.create({
            username,
            email,
            password: hashedPassword,
            phone
        })
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(201).json({
            msg:"User registered successfully",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        })
    }catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const Login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg:"Please provide all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid credentials"});
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({
            msg:"Login successful",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age
            }
        })
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}
const Logout = async(req, res) =>{
    res.clearCookie("token");
    res.status(200).json({msg:"Logout successful"});
}
module.exports = {register, Login, Logout};