import React, { useEffect, useState } from "react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";
import { createMessages, getMessages } from "../../actions/messagesActions";

const Chatbox = ({ users, currentChat, user }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const [textMessage, setTextMessage] = useState("");

  useEffect(() => {
    if (currentChat && currentChat.members.length >= 2) {
      const chatId = currentChat.members[1];
      dispatch(getMessages(chatId));
    }
  }, [currentChat]);

  const handleMessage = () => {
    dispatch(createMessages(currentChat.members[1], user._id, textMessage));
    setTextMessage(""); // Clear the input field after sending
  };

  return (
    <div>
      Chatbox
      <div>
        {messages.map((message) => (
          <div
            key={message._id}
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
