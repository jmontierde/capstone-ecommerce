import React, { useEffect, useState } from "react";
import { getUserChats, createChat } from "../../actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../actions/userActions";
import { getMessages, createMessages } from "../../actions/messagesActions";

import moment from "moment";
import InputEmoji from "react-input-emoji";
import Chatbox from "./Chatbox";
const UserChat = (props) => {
  const { chats, error } = useSelector((state) => state.userChats);
  const { users } = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.auth);
  const { messages, loading } = useSelector((state) => state.messages);

  // const { newChat } = useSelector((state) => state.createChat);

  const dispatch = useDispatch();

  const firstId = user.user._id;
  const [getName, setGetName] = useState("");

  console.log("CHATS", chats);

  const [secondId, setSecondId] = useState(null);

  //Create Message
  // const [chatId, setChatId] = useState(secondId);
  const [senderId, setSenderId] = useState("");
  const [text, setText] = useState("");

  const getId = (secondId, getName) => {
    setSecondId(secondId);
    setGetName(getName);
    dispatch(createChat(firstId, secondId));
    dispatch(getMessages(secondId));
  };

  function handleMessage(secondId, firstId, text) {
    dispatch(createMessages(secondId, firstId, text));
    setText(""); // Clear the message input
  }

  //Create Chat

  useEffect(() => {
    dispatch(allUsers());
    dispatch(getUserChats(props.user._id));
  }, [dispatch]);

  return (
    <div className="flex w-screen">
      <div className="flex justify-between items-center bg-[#222] w-1/2">
        <div className="flex justify-between  items-center space-x-1 ml-3">
          <div>
            {user.user.role === "user" ? (
              <>
                {users
                  .filter(
                    (userFilt) =>
                      userFilt.role === "admin" || userFilt.role === "staff"
                  )
                  .map((user) => (
                    <div
                      className="flex items-center space-x-3 px-6 py-3 bg-[#9b8989] my-3"
                      onClick={() => getId(user._id, user.name)}
                    >
                      <img
                        src={user.avatar.url}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <h1>{user.name}</h1>
                        <p>Text message</p>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {users
                  .filter((userFilt) => userFilt.role === "user")
                  .map((user) => (
                    <div
                      className="flex items-center space-x-3 px-6 py-3 bg-[#9b8989] my-3"
                      onClick={() => getId(user._id)}
                    >
                      <img
                        src={user.avatar.url}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <h1>{user.name}</h1>
                        <p>Text message</p>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h4>12/12/2023</h4>
          <p className="bg-[#4da1bc] rounded-full w-8 h-8 text-center">2</p>
        </div>
      </div>

      {/* CHAT BOX */}
      <div className="bg-[#c7a6a6] w-1/2">
        <h1 className="bg-[#dfc9c9] py-3">{getName}</h1>
        <div className="p-6 space-y-3">
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages available</p>
          ) : (
            // className="bg-[#b76363] flex flex-col p-3"
            messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  firstId === user.user._id
                    ? "flex items-end justify-end flex-grow-0 bg-[#af9393]"
                    : "flex items-start justify-start text-start flex-grow-0 bg-slate-500"
                }`}
              >
                <span>{message.text}</span>
                <span className="text-[#1c1c1c]">
                  {moment(message.createdAt).format("llll")}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="p-6 space-x-3 flex-grow-0">
          <InputEmoji
            value={text}
            onChange={setText}
            placeholder="Type a message"
          />
          <button
            className="bg-[#aaa6a6] rounded px-6 py-1 text-sm"
            onClick={() => handleMessage(secondId, firstId, text)}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
