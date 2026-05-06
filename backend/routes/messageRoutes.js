const express = require("express");

const router = express.Router();

const authMiddleware = require("../middelware/authMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post(
  "/",
  authMiddleware,
  sendMessage
);

router.get(
  "/:chatId",
  authMiddleware,
  getMessages
);

module.exports = router;