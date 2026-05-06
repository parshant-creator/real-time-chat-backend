const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        default :'sender'
    },
    isGroupChat:{
        type:Boolean,
        default: false,
    },
    users:[
        {type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("chat", chatSchema);