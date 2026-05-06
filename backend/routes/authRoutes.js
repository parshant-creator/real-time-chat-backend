const express = require('express');
const router = express.Router();
const { register, Login} = require('../controllers/authController');
const authMiddleware = require('../middelware/authMiddleware');
router.post("/register", register);
router.post("/login", Login);
router.get("/profile", authMiddleware, (req,res)=>{
    res.json({msg:"this is a protected route",
         user: req.user});
});
module.exports = router;