const chatModel = require("../models/chatModel");
const createChat = async (req, res) =>{
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({msg:"please provide userId"});
        }
        let chat = await chatModel.findOne({
            users:{$all:[req.user.id, userId]}
        }).populate("users", "-password");
        if(chat){
            return res.status(200).json(chat);
        }
        chat = await chatModel.create({
            users:[req.user.id, userId]
        })
        const fullChat = await chatModel.findById(chat._id).populate("users", "-password");
        res.status(201).json(fullChat);
    }
    catch(error){
        res.json({
            status:500,
            success:false,
            error:error.message
        })
    }
}
const getChats = async (req, res) =>{
    try{
        const chats = await chatModel.find({
            users:{$in:[req.user.id]}
        }).populate("users","-password")
        .populate({
  path: "latestMessage",
  populate: {
    path: "sender",
    select: "username email",
  },
})
        res.status(200).json(chats);
    }
    catch(error){
        res.json({
            status:500,
            success:false,
            error:error.message
        })
    }
}
module.exports = { createChat, getChats };