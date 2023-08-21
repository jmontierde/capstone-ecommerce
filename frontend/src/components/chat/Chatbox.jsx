import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";
import { createMessages, getMessages } from "../../actions/messagesActions";
import { GET_MESSAGES_SUCCESS } from "../../constants/messageConstants";

const Chatbox = ({ users, currentChat, user, socket }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const [textMessage, setTextMessage] = useState("");
  // Create a ref to hold the last message element
  const lastMessageRef = useRef(null);
  useEffect(() => {
    if (currentChat && currentChat.members.length >= 2) {
      const chatId = currentChat.members[1];
      dispatch(getMessages(chatId));
    }
  }, [dispatch, currentChat]);

  const handleMessage = async () => {
    // Optimistically update the UI with the new message
    const newMessage = {
      _id: new Date().getTime(), // Temporary ID for optimistic update
      senderId: user._id,
      text: textMessage,
      createdAt: new Date().toISOString(),
    };

    // Update the UI optimistically
    const updatedMessages = [...messages, newMessage];
    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: updatedMessages,
    });

    socket.emit("sendMessage", {
      ...newMessage,
      chatId: currentChat.members[1],
    });
    // Send the message to the server
    try {
      await dispatch(
        createMessages(currentChat.members[1], user._id, textMessage)
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setTextMessage("");
  };

  return (
    <div>
      Chatbox
      <div>
        {messages.map((message) => (
          <div
            key={message._id} // Add a unique key prop here
            className={`${
              message.senderId === user._id
                ? "flex items-end justify-end flex-grow-0 bg-[#1e3f65]"
                : "flex items-start justify-start text-start flex-grow-0 bg-[#a33296]"
            }`}
          >
            <span>{message.text}</span>
            <span className="text-[#1c1c1c]">
              {moment(message.createdAt).format("llll")}
            </span>
          </div>
        ))}
      </div>
      <div className="p-6 space-x-3 flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          placeholder="Type a message"
        />
        <button
          className="bg-[#aaa6a6] rounded px-6 py-1 text-sm"
          onClick={handleMessage}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
