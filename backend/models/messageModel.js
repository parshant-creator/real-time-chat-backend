const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chat",
    required: true,
  },
  media:{
    type:String
  },
  mediaType:{
    type:String
  },
  contact:{
    name:String,
    phone:String
  }
  ,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Message", messageSchema);
