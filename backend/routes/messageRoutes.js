const express = require("express");
const uploads = require("../middelware/multer")
const router = express.Router();

const authMiddleware = require("../middelware/authMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post(
  "/",
  authMiddleware,
  uploads.single('media'),
  sendMessage
);

router.get(
  "/:chatId",
  authMiddleware,
  getMessages
);

module.exports = router;