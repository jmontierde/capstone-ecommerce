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
  const [newMessage, setNewMessage] = useState(null);

  const updateCurrentChat = (chat) => {
    setCurrentChat(chat); // Store the chat ID
  };

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  // Sokcet
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser", user._id);
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });
    }
  }, [socket]);

  // Send Message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user._id);
    console.log("SOCKET", recipientId);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  console.log("CURREN", currentChat);
  // Receive Message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat.members[1] !== res.chatId) return;

      setNewMessage((prevMessages) => [...prevMessages, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat, user]);

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
              {chats?.map((chat) => (
                <div key={chat._id} onClick={() => updateCurrentChat(chat)}>
                  <MyUserChat
                    chat={chat}
                    users={users}
                    user={user}
                    onlineUsers={onlineUsers}
                  />
                </div>
              ))}
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
