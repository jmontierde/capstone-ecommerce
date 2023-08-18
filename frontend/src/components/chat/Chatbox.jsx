import React, { useEffect, useState } from "react";
import { createMessages, getMessages } from "../../actions/messagesActions";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";

const Chatbox = ({ users, currentChat, user }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);

  const [textMessage, setTextMessage] = useState("");

  console.log("CURRENT CHAT", currentChat);

  useEffect(() => {
    if (currentChat && currentChat.members.length >= 2) {
      const chatId = currentChat.members[1]; // Assuming chat ID is in the second position
      dispatch(getMessages(chatId));
    }
  }, [currentChat]);

  return (
    <div>
      Chatbox
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <div className="p-6 space-x-3 flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          placeholder="Type a message"
        />
        <button className="bg-[#aaa6a6] rounded px-6 py-1 text-sm">SEND</button>
      </div>
    </div>
  );
};

export default Chatbox;
