const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
// const Chat = require("../models/chat");
const Message = require("../models/message");

//Create a category
exports.createMessage = catchAsyncErrors(async (req, res, next) => {
  const { chatId, senderId, text } = req.body;

  // const message = new Message({
  //     chatId, senderId, text
  // })

  try {
    const message = await Message({
      chatId,
      senderId,
      text,
    }).save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Message creation failed",
    });
  }
});

// Get Message

exports.getMessages = catchAsyncErrors(async (req, res, next) => {
  const chatId = req.params.chatId; // Corrected line

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      messages: "Get Message failed",
    });
  }
});
