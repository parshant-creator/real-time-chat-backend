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
};
const createGroupChat = async (req, res) => {
  try {
    let { chatName, users } = req.body;

    if (!chatName || !users) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    // string -> array
    users = JSON.parse(users);

    users.push(req.user.id);

    const groupChat = await chatModel.create({
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user.id,

      groupIcon: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : "",
    });

    const fullGroupChat = await chatModel
      .findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteGroup = async (req, res)=>{
  try{
    const {groupId} = req.params;
    const group = await chatModel.findById(groupId);
    if(!group){
      return res.status(404).json({
        success:false,
        msg:"group not found"
      })
    }
    if(
      group.groupAdmin.toString() !== req.user.id)
    {
      return res.status(403).json({
        success:false,
        msg:"only admin can delete group"
      })
    }
    await chatModel.findByIdAndDelete(groupId)
    res.json({
      success:true,
      msg:"group is deleted"
    })
  }catch(error){
    res.status(500).json({
      error:error.message,
      success:false
    })
  }
}
module.exports = { createChat, getChats, createGroupChat , deleteGroup }