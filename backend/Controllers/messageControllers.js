const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const deleteallMessages=asyncHandler(async(req,res)=>{
await Message.deleteMany({});
console.log("delert");
})
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  
  const {isImg,ImgContent, ImgOCRContent, content, chatId } = req.body;

  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }


  try {
    var message;
    if(isImg){

     message = await Message.create({ sender: req.user._id,isImg:true,ImgContent:ImgContent,ImgOCRContent:ImgOCRContent, content:content, chat: chatId });
    //  console.log("erero");
    }
    else{
      message = await Message.create({ sender: req.user._id,isImg:false,ImgOCRContent:"",ImgContent:"", content:content, chat: chatId });
      // console.log(message);
    }
    message = await (
      await message.populate("sender", "name pic")
    ).populate({
      path: "chat",
      select: "chatName isGroupChat users",
      model: "Chat",
      populate: { path: "users", select: "name email pic", model: "User" },
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage ,deleteallMessages};
