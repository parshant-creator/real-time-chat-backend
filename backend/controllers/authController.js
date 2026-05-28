const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs= require("fs")
const { validationResult } = require("express-validator");
const register = async (req, res)=>{
    try{
        const errors = validationResult(req);

if (!errors.isEmpty()) {

  const errorMessages = errors.array().map(
    (err) => err.msg
  );

  return res.status(400).json({
    success: false,
    msg: errorMessages[0],
  });
}
 const { username, email, password, phone } = req.body;
        const userExist = await User.findOne({email});
        if(userExist){
             return res.status(400).json({
    success: false,
    message: "User already exists",
  });
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
        const user  = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            avtar: req.file
    ? `https://real-time-chat-backend-yx6a.onrender.com/uploads/${req.file.filename}`
    : undefined,
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

  res.status(500).json({
    success: false,
    message: "Server Error",
  });

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
// const updateUser = async (req, res) => {
//   try {
// const errors = validationResult(req);

// if (!errors.isEmpty()) {
//   return res.status(400).json({
//     success: false,
//     errors: errors.array(),
//   });
// }
//     // only logged in user can update own profile
//     if (req.user._id.toString() !== req.params.id) {
//       return res.status(403).json({
//         success: false,
//         msg: "Unauthorized",
//       });
//     }

//     const oldUser = await User.findById(req.params.id);

//     if (!oldUser) {
//       return res.status(404).json({
//         success: false,
//         msg: "User not found",
//       });
//     }

//     const updateData = { ...req.body };

//     // hash password if updating password
//     if (updateData.password) {
//   const salt = await bcrypt.genSalt(10);

//   updateData.password = await bcrypt.hash(
//     updateData.password,
//     salt
//   );
// }

//     // update avatar
//     if (req.file) {

//       // delete old image
//       if (
//         oldUser.avtar &&
//         !oldUser.avtar.includes("default.png")
//       ) {

//         const oldImagePath = path.join(
//           __dirname,
//           "..",
//           "public",
//           "uploads",
//           oldUser.avtar.split("/uploads/")[1]
//         );

//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }

//       updateData.avtar =
//         `https://real-time-chat-backend-yx6a.onrender.com/uploads/${req.file.filename}`;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password");

//     res.status(200).json({
//       success: true,
//       msg: "Profile updated successfully",
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         avtar: user.avtar,
//       },
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });

//   }
// };
const updateUser = async (req, res) => {
  try {

    const errors = validationResult(req);

    // VALIDATION ERRORS
    if (!errors.isEmpty()) {

      const errorMessages = errors.array().map(
        (err) => err.msg
      );

      return res.status(400).json({
        success: false,
        msg: errorMessages[0],
        errors: errorMessages,
      });
    }

    // ONLY OWN PROFILE UPDATE
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const oldUser = await User.findById(req.params.id);

    if (!oldUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const updateData = { ...req.body };

    // EMAIL ALREADY EXISTS CHECK
    if (updateData.email) {

      const emailExist = await User.findOne({
        email: updateData.email,
        _id: { $ne: req.params.id },
      });

      if (emailExist) {
        return res.status(400).json({
          success: false,
          msg: "Email already exists",
        });
      }
    }

    // PASSWORD HASH
    if (updateData.password) {

      const salt = await bcrypt.genSalt(10);

      updateData.password = await bcrypt.hash(
        updateData.password,
        salt
      );
    }

    // AVATAR UPDATE
    if (req.file) {

      // DELETE OLD IMAGE
      if (
        oldUser.avtar &&
        !oldUser.avtar.includes("default.png")
      ) {

        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
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

    // UPDATE USER
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avtar: user.avtar,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      msg: "Server Error",
      error: error.message,
    });

  }
};
module.exports = {register, Login, Logout , updateUser};