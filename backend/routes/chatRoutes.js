const express = require('express');
const router = express.Router();
const {createChat , getChats} = require('../controllers/chatController');
const authMiddleware = require('../middelware/authMiddleware');
router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);
module.exports = router;