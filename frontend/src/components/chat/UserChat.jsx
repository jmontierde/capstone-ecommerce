import React, { useEffect, useState } from "react";
import { getUserChats, createChat, getChat } from "../../actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../actions/userActions";
import { getMessages, createMessages } from "../../actions/messagesActions";

import axios from "axios";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Chatbox from "./Chatbox";
const UserChat = (props) => {
  // const { users, error } = useSelector((state) => state.userChats);
  const { chat } = useSelector((state) => state.chat);
  const { chats } = useSelector((state) => state.userChats);
  const { messages, loading } = useSelector((state) => state.messages);

  const { users } = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [currentChat, setCurrentChat] = useState(null);
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    dispatch(allUsers());
    dispatch(getUserChats(user.user._id));
  }, [dispatch]);

  const startChat = async (recipientId, userName) => {
    setUserName(userName);
    setCurrentChat(recipientId); // Update currentChat state
    dispatch(getMessages(recipientId)); // Fetch messages for the clicked user (sender)
  };

  console.log(currentChat);

  const handleMessage = async () => {
    if (!text || !currentChat) return;
    dispatch(createMessages(currentChat, user.user._id, text));
    setText("");
  };

  return (
    <div className="flex w-screen">
      <div className="flex justify-between items-center bg-[#222] w-1/2">
        <div className="flex justify-between  items-center space-x-1 ml-3">
          <div>
            {users
              .filter((u) => u._id !== user.user._id)
              .map((currentUser) => (
                <div
                  className="flex items-center space-x-3 px-6 py-3 bg-[#9b8989] my-3"
                  onClick={() => startChat(currentUser._id, currentUser.name)}
                  key={currentUser._id}
                >
                  <img
                    src={currentUser.avatar.url}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h1>{currentUser.name}</h1>
                    <p>Text message</p>
                  </div>
                </div>
              ))}

            {/* {users
              .filter((u) => u._id !== user.user._id) // Exclude the logged-in user
              .map((currentUser) => (
                <div
                  className="flex items-center space-x-3 px-6 py-3 bg-[#9b8989] my-3"
                  onClick={() => startChat(currentUser._id, currentUser.name)}
                  key={currentUser._id} // Add a unique key
                >
                  <img
                    src={currentUser.avatar.url}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h1>{currentUser.name}</h1>
                    <p>Text message</p>
                  </div>
                </div>
              ))} */}
            {/* {user.user.role === "user" ? (
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
            )} */}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h4>12/12/2023</h4>
          <p className="bg-[#4da1bc] rounded-full w-8 h-8 text-center">2</p>
        </div>
      </div>

      {/* CHAT BOX */}
      <div className="bg-[#c7a6a6] w-1/2">
        <h1 className="bg-[#dfc9c9] py-3">{userName}</h1>
        <div className="p-6 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.senderId === user.user._id
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
            value={text}
            onChange={setText}
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
    </div>
  );
};

export default UserChat;
