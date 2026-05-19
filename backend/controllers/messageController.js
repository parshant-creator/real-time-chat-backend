const messageModel = require("../models/messageModel");

const chatModel = require("../models/chatModel");

const sendMessage = async (req, res) => {

  try {
const media = req.file
  ? `http://localhost:4000/uploads/${req.file.filename}`
  : "";

const mediaType = req.file
  ? req.file.mimetype.startsWith("video")
    ? "video"
    : "image"
  : "";
    const { content, chatId } = req.body;

    if (!content && !req.file || !chatId) {

      return res.status(400).json({
        success: false,
        msg: "Please provide content and chatId",
      });

    }

    let message = await messageModel.create({
      sender: req.user.id,
      content,
      chat: chatId,
      media,
      mediaType,
    });

    message = await message.populate(
      "sender",
      "username email"
    );

    message = await message.populate({
      path: "chat",
      populate: {
        path: "users",
        select: "username email",
      },
    });

    await chatModel.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message._id,
      }
    );

    res.status(201).json(message);

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

};

const getMessages = async (req, res) => {

  try {

    const messages = await messageModel
      .find({
        chat: req.params.chatId,
      })
      .populate(
        "sender",
        "_id username email"
      )
      .populate("chat");

    res.status(200).json(messages);

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

};

module.exports = {
  sendMessage,
  getMessages,
};