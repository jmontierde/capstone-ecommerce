const express = require("express");
const router = express.Router();

// Route from POSTMAN

const {
  createChat,
  findChat,
  findUserChatById, // Add this line,
} = require("../controllers/chatController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/chats").post(isAuthenticatedUser, createChat);
router.route("/chat/:userId").get(isAuthenticatedUser, findUserChatById);
router
  .route("/chat/find/:firstId/:secondId")
  .get(isAuthenticatedUser, findChat);

module.exports = router;
