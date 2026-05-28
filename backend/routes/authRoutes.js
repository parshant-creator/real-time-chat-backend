const express = require('express');
const router = express.Router();
const { register, Login , Logout , updateUser} = require('../controllers/authController');
const{registerValidation,updateValidation} =require("../middelware/validation")
const uploads = require("../middelware/multer");
const authMiddleware = require('../middelware/authMiddleware');

router.post("/register",uploads.single('avtar'),registerValidation, register);
router.post("/login", Login);
router.get("/profile", authMiddleware, (req,res)=>{
    res.json({msg:"this is a protected route",
         user: req.user});
});
router.put(
  "/profile/:id",
  authMiddleware,
  uploads.single("avtar"),
  updateValidation,
  updateUser
);
router.post("/logout", Logout);
module.exports = router;