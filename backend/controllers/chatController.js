const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Chat = require("../models/chat");

//Create a category
exports.createChat = catchAsyncErrors(async (req, res, next) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new Chat({
      members: [firstId, secondId],
    });

    const createChat = await newChat.save();

    res.status(201).json({
      success: true,
      createChat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      chat: "Chat creation failed",
    });
  }
});

exports.findUserChatById = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      chat: "Find User Chats by ID failed",
    });
  }
});

//Find  Chat
exports.findChat = catchAsyncErrors(async (req, res, next) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      chat: "Find User Chats failed",
    });
  }
});
