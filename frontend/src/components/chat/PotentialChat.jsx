import React, { useEffect, useState } from "react";

import { createChat } from "../../actions/chatActions";
import { useDispatch, useSelector } from "react-redux";

const PotentialChat = ({ users, chats, user, onlineUsers }) => {
  const dispatch = useDispatch();

  console.log("POTENTIAL", onlineUsers);
  //   const pChats = users.filter((u) => {
  //     let isChatCreated = false;

  //     if (chats) {
  //       isChatCreated = chats?.some((chat) => {
  //         chat.members[0] === u._id || chat.members[1] === u._id;
  //       });
  //     }
  //   });

  //   useEffect(() => {

  //   }, [dispatch])

  return (
    <div>
      PotentialChat
      <div className="flex bg-[#549ebb] space-x-3">
        {users &&
          users
            .filter((uFilt) => uFilt._id !== user._id)
            .map((u, index) => (
              <div
                key={index}
                onClick={() => dispatch(createChat(user._id, u._id))}
              >
                {u.name}
                <span
                  className={
                    onlineUsers?.some((user) => user?.userId === u?._id)
                      ? "bg-[#249320] rounded-full"
                      : ""
                  }
                >
                  Online
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PotentialChat;
