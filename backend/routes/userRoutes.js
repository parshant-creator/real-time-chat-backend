const express = require("express");
const router = express.Router();
const user = require("../models/userModel");
router.get("/", async (req, res) => {
  try {
    const users = await user.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({
        msg:"server error"
    })
  }
});
module.exports= router;