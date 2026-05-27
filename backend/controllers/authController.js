const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs= require("fs")
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
        let avtarUrl="https://real-time-chat-backend-yx6a.onrender.com/uploads/default.png";
        if(req.file){
            avtarUrl =`https://real-time-chat-backend-yx6a.onrender.com/uploads/${req.file.filename}`
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user  = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            avtar: avtarUrl
        })
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(201).json({
            msg:"User registered successfully",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avtar:user.avtar
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
                phone: user.phone,
                avtar: user.avtar
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
const updateUser = async (req, res) => {
  try {

    const oldUser = await User.findById(req.params.id);

    const updateData = { ...req.body };

    if (req.file) {

      // old image delete
      if (
        oldUser.avtar &&
        !oldUser.avtar.includes("default.png")
      ) {

        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          oldUser.avtar.split("/uploads/")[1]
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.avtar =
        `https://real-time-chat-backend-yx6a.onrender.com/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Profile updated",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};
module.exports = {register, Login, Logout , updateUser};