import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers } from "../../actions/userActions";
import MyUserChat from "./MyUserChat";
import Chatbox from "./Chatbox";
import PotentialChat from "./PotentialChat";

const Chat = () => {
  const { chats, loading } = useSelector((state) => state.userChats);
  const { users } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [currentChat, setCurrentChat] = useState(null);

  // const filteredChats = chats.filter(
  //   (chat) => chat.members[0] === user._id || chat.members[1] === user._id
  // );

  // const filterUser = users.filter(u => u.id === filteredChats)

  // console.log("filteredChats", filteredChats);

  const updateCurrentChat = (chat) => {
    setCurrentChat(chat); // Store the chat ID
  };

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  return (
    <div className="flex">
      <div className="flex flex-col container py-6 mx-auto bg-[#4bbf64] w-1/2">
        <PotentialChat users={users} chats={chats} user={user} />

        {chats?.length < 1 ? null : (
          <section className="px-12 flex justify-between w-screen">
            <div>
              {loading && <p>Loading chats...</p>}
              {chats?.map((chat) => (
                <div key={chat._id} onClick={() => updateCurrentChat(chat)}>
                  <MyUserChat chat={chat} users={users} user={user} />
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
