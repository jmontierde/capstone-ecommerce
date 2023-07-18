const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// Send a new message
router.post("/", async (req, res) => {
  const { sender, recipient, content } = req.body;

  try {
    const newMessage = await Message.create({ sender, recipient, content });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

// Get all messages between two users
router.get("/:senderId/:recipientId", async (req, res) => {
  const { senderId, recipientId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort("timestamp");

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve messages" });
  }
});

module.exports = router;
