const express = require("express");
const router = express.Router();
const uploads = require("../middelware/multer");
const {
  createChat,
  getChats,
  createGroupChat,
  deleteGroup,
} = require("../controllers/chatController");
const authMiddleware = require("../middelware/authMiddleware");
router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);
router.post(
  "/group",
  authMiddleware,
  uploads.single("groupIcon"),
  createGroupChat,
);
router.delete("/group/:groupId", authMiddleware ,deleteGroup)
module.exports = router;
