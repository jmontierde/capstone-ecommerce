import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";
import {
  createMessages,
  getMessages,
  initRealTimeMessages,
} from "../../actions/messagesActions";
import { receiveMessage } from "../../actions/messagesActions";
import { RECEIVE_MESSAGE } from "../../constants/messageConstants";

const Chatbox = ({ users, currentChat, user, socket }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const [textMessage, setTextMessage] = useState("");

  useEffect(() => {
    dispatch(initRealTimeMessages());
    dispatch(getMessages(currentChat?._id));
  }, [dispatch, currentChat?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (res) => {
        if (currentChat?._id !== res.chatId) return;
        console.log("Received real-time message via socket:", res.message);
        // dispatch(receiveMessage(res.message, ...messages));
        dispatch(receiveMessage(res.message));
        dispatch(getMessages(currentChat?._id));
      });

      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket, currentChat?._id, dispatch, messages]);

  const handleSendMessage = () => {
    if (textMessage.trim() !== "") {
      dispatch(createMessages(currentChat?._id, user._id, textMessage));

      setTextMessage("");
    }
  };

  return (
    <div>
      Chatbox
      <div>
        {messages.map((message, index) => (
          <div
            key={index} // Use index as a key
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
          onClick={handleSendMessage}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
