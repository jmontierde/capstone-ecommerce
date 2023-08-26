import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";
import {
  createMessages,
  getMessages,
  initRealTimeMessages,
} from "../../actions/messagesActions";
import { GET_MESSAGES_SUCCESS } from "../../constants/messageConstants";
import { receiveMessage } from "../../actions/messagesActions";
// import { addMessage } from "../../actions/messagesActions";
import { io } from "socket.io-client";

const Chatbox = ({ users, currentChat, user }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const [textMessage, setTextMessage] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // Handle the error, e.g., display a message to the user
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    dispatch(initRealTimeMessages());
    dispatch(getMessages(currentChat?._id));
  }, [dispatch, currentChat?._id]);

  useEffect(() => {
    if (socket) {
      const messageListener = (data) => {
        dispatch({
          type: GET_MESSAGES_SUCCESS,
          payload: [data.message, ...messages],
        });
      };

      socket.on("getMessage", messageListener);
      dispatch(getMessages(currentChat?._id));

      return () => {
        console.log("Unsubscribing from getMessage event");
        socket.off("getMessage", messageListener);
      };
    }
  }, [socket, messages, dispatch]);

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
          onClick={handleSendMessage}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
