const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    groupIcon: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/921/921347.png",
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("chat", chatSchema);
