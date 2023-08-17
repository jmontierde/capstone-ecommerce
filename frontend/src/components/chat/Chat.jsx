import React from "react";

import { useSelector, useDispatch } from "react-redux";
import UserChat from "./UserChat";
import Chatbox from "./Chatbox";

const Chat = () => {
  const { chats, loading } = useSelector((state) => state.userChats);

  return (
    <>
      <div className="flex container py-6 mx-auto bg-[#4bbf64] w-screen">
        {chats?.length < 1 ? null : (
          <section className="px-12 flex justify-between w-screen">
            <div className="w-full">
              {loading && <p>Loading chats...</p>}
              <UserChat chats={chats} />

              {/* {chats.map((chat, index) => (
                <div key={index}>
                  <UserChat chats={chat} />
                </div>
              ))} */}
            </div>
            {/* <div className="flex flex-col">
              <Chatbox />
            </div> */}
          </section>
        )}
      </div>
    </>
  );
};

export default Chat;
