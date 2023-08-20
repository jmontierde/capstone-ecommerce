// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { allUsers, login } from "../../actions/userActions";
// import MyUserChat from "./MyUserChat";
// import Chatbox from "./Chatbox";
// import PotentialChat from "./PotentialChat";

// const Chat = () => {
//   const { chats, loading } = useSelector((state) => state.userChats);
//   const { users } = useSelector((state) => state.allUsers);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const [currentChat, setCurrentChat] = useState(null);

//   // Filter out chats that have no user IDs
//   const filteredChats = chats.filter(
//     (chat) => chat.members && chat.members.length >= 2
//   );

//   const augmentedUsers = users
//     .filter((uFilt) => uFilt._id !== user._id)
//     .map((u) => ({
//       ...u,
//       chats: filteredChats.filter(
//         (chat) =>
//           chat.members.includes(u._id) || chat.members.includes(user._id)
//       ),
//     }));

//   const updateCurrentChat = (chat) => {
//     setCurrentChat(chat); // Store the chat ID
//   };

//   useEffect(() => {
//     dispatch(allUsers());
//   }, [dispatch]);

//   return (
//     <div className="flex">
//       <div className="flex flex-col container py-6 mx-auto bg-[#4bbf64] w-1/2">
//         <PotentialChat users={users} chats={chats} user={user} />

//         {filteredChats.length < 1 ? null : (
//           <section className="px-12 flex justify-between w-screen">
//             <div>
//               {loading && <p>Loading users...</p>}

//               {augmentedUsers.map((user) => (
//                 <div key={user._id}>
//                   <div>{user.name}</div>
//                   <div>
//                     {user.chats.map((userChat) => (
//                       <MyUserChat
//                         key={userChat._id}
//                         chat={userChat} // Pass the chat object
//                         users={users}
//                         user={user}
//                         onClick={() => updateCurrentChat(userChat)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//       <div className="flex flex-col w-1/2">
//         <Chatbox users={users} currentChat={currentChat} user={user} />
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { allUsers } from "../../actions/userActions";
// import MyUserChat from "./MyUserChat";
// import Chatbox from "./Chatbox";
// import PotentialChat from "./PotentialChat";

// const Chat = () => {
//   const { chats, loading } = useSelector((state) => state.userChats);
//   const { users } = useSelector((state) => state.allUsers);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const [selectedUser, setSelectedUser] = useState(null);

//   const updateSelectedUser = (user) => {
//     setSelectedUser(user); // Store the selected user
//   };

//   useEffect(() => {
//     dispatch(allUsers());
//   }, [dispatch]);

//   const selectedUserChats = selectedUser
//   ? chats.filter((chat) => chat.members.includes(selectedUser._id))
//   : [];

//   return (
//     <div className="flex">
//       <div className="flex flex-col container py-6 mx-auto bg-[#4bbf64] w-1/2">
//         <PotentialChat users={users} chats={chats} user={user} />

//         <section className="px-12 flex justify-between w-screen">
//           <div>
//             {loading && <p>Loading users...</p>}
//             {users.map((user) => (
//               <div key={user._id} onClick={() => updateSelectedUser(user)}>
//                 <MyUserChat user={user} />
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//       <div className="flex flex-col w-1/2">
//         <Chatbox users={users} chats={selectedUserChats} user={user} />
//       </div>
//     </div>
//   );
// };

// export default Chat;

///////////
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
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive Message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?.id !== res.chatId) return;

      setNewMessage((prev) => [...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

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
        <Chatbox users={users} currentChat={currentChat} user={user} />
      </div>
    </div>
  );
};

export default Chat;
