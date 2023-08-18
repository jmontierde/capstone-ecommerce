import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import UserChat from "./UserChat";
import Chatbox from "./Chatbox";
import { allUsers } from "../../actions/userActions";
import MyUserChat from "./MyUserChat";
import PotentialChat from "./PotentialChat";

const Chat = () => {
  // Redux store
  const { chats, loading } = useSelector((state) => state.userChats);
  const { users } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.auth);
  // const { chat } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  // Use State
  const [currentChat, setCurrentChat] = useState(null);

  const updateCurrentChat = (currentChat) => {
    setCurrentChat(currentChat);
  };

  console.log("CURRENT CHAT CURRENT", currentChat);

  useEffect(() => {
    dispatch(allUsers());
  }, dispatch);

  return (
    <div className="flex">
      <div className="flex flex-col container py-6 mx-auto bg-[#4bbf64] w-1/2">
        <PotentialChat users={users} chats={chats} user={user} />

        {chats?.length < 1 ? null : (
          <section className="px-12 flex justify-between w-screen">
            <div>
              {loading && <p>Loading chats...</p>}
              {chats?.map((chat, index) => (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  {/* <UserChat chat={chat} users={users} /> */}
                  <MyUserChat chat={chat} users={users} user={user} />
                </div>
              ))}

              {/* <UserChat chats={chats} /> */}

              {/* {chats.map((chat, index) => (
                <div key={index}>
                  <UserChat chats={chat} />
                </div>
              ))} */}
            </div>
          </section>
        )}
      </div>
      <div className="flex flex-col  w-1/2">
        <Chatbox users={users} currentChat={currentChat} user={user} />
      </div>
    </div>
  );
};

export default Chat;
