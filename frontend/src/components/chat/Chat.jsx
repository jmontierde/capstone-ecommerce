import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers } from "../../actions/userActions";
import MyUserChat from "./MyUserChat";
import Chatbox from "./Chatbox";
import PotentialChat from "./PotentialChat";
import { io } from "socket.io-client";

const Chat = () => {
  const { chats, loading } = useSelector((state) => state.userChats);
  const { users } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [currentChat, setCurrentChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const updateCurrentChat = (chat) => {
    setCurrentChat(chat); // Store the chat ID
  };

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
      newSocket.emit("addNewUser", user._id);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user._id]);

  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser", user._id);
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });
    }
  }, [socket]);

  return (
    <div className="flex">
      <div className="flex flex-col container py-6 mx-auto bg-[#4bbf64] w-1/2">
        <PotentialChat
          users={users}
          chats={chats}
          user={user}
          onlineUsers={onlineUsers}
        />

        {chats?.length < 1 ? null : (
          <section className="px-12 flex justify-between w-screen">
            <div>
              {loading && <p>Loading chats...</p>}
              {chats?.map((chat) => {
                const recipientId = chat?.members.find((id) => id !== user._id);
                const recipientUser = users.find((u) => u._id === recipientId);

                if (!recipientUser) {
                  // User doesn't exist, skip rendering this chat
                  return null;
                }

                return (
                  <div key={chat._id} onClick={() => updateCurrentChat(chat)}>
                    <MyUserChat
                      chat={chat}
                      users={users}
                      user={user}
                      onlineUsers={onlineUsers}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
      <div className="flex flex-col w-1/2">
        <Chatbox
          users={users}
          currentChat={currentChat}
          user={user}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Chat;
