import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createChat } from "../../actions/chatActions";

const PotentialChat = ({ users, user, onlineUsers, chats }) => {
  const dispatch = useDispatch();

  const [potentialChat, setPotentialChat] = useState([]);

  useEffect(() => {
    const pChats = users.filter((u) => {
      let isChatCreated = false;

      if (user._id === u._id) return false;

      if (chats) {
        isChatCreated = chats?.some((chat) => {
          return (
            (chat.members[0] === user._id && chat.members[1] === u._id) ||
            (chat.members[0] === u._id && chat.members[1] === user._id)
          );
        });
      }

      return !isChatCreated;
    });
    setPotentialChat(pChats);
  }, [users, chats, user._id]);

  return (
    <div>
      PotentialChat
      <div className="flex bg-[#549ebb] space-x-3">
        {potentialChat &&
          potentialChat.map(
            (u, index) => (
              console.log("USER", user._id),
              console.log("U", u._id),
              (
                <div
                  key={index}
                  onClick={() => dispatch(createChat(user._id, u._id))}
                >
                  <h1>{u.name} </h1>
                  <span
                    className={
                      onlineUsers?.some((user) => user?.userId === u?._id)
                        ? "bg-[#249320] rounded-full"
                        : ""
                    }
                  >
                    {onlineUsers?.some((user) => user?.userId === u?._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              )
            )
          )}
        {/* {users &&
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
                  {onlineUsers?.some((user) => user?.userId === u?._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            ))} */}
      </div>
    </div>
  );
};

export default PotentialChat;
