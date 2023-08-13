import React, { useEffect, useState } from "react";
import { getUserChats } from "../../actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../actions/userActions";
import { createChat } from "../../actions/chatActions";
import { getMessages } from "../../actions/messagesActions";
import moment from "moment";
import Chatbox from "./Chatbox";
const UserChat = (props) => {
  const { chats, error } = useSelector((state) => state.userChats);
  const { users } = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.auth);
  const { messages, loading } = useSelector((state) => state.messages);

  const { newChat } = useSelector((state) => state.createChat);

  const dispatch = useDispatch();

  if (user.user.role === "user") {
    const chatAdmin = users
      .filter(
        (userFilt) => userFilt.role === "admin" || userFilt.role === "staff"
      )
      .map((adminUser) => adminUser);
  } else {
    const chatUser = users
      .filter((userFilt) => userFilt.role === "user")
      .map((user) => user);
  }

  const firstId = user.user._id;
  const [secondId, setSecondId] = useState(null);

  const getId = (secondId) => {
    setSecondId(secondId);
    dispatch(createChat(firstId, secondId));
    dispatch(getMessages(secondId));
  };

  console.log("MY MESSAGES", messages);

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
        <h1>HELLO WORLD</h1>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages available</p>
        ) : (
          messages.map((message, index) => (
            <div key={index}>
              <span>{message.text}</span>
              <span>{moment(message.createdAt).calendar()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserChat;
