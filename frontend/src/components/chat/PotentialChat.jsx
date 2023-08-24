import React from "react";
import { useDispatch } from "react-redux";
import { createChat } from "../../actions/chatActions";

const PotentialChat = ({ users, user, onlineUsers }) => {
  const dispatch = useDispatch();

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
                  {onlineUsers?.some((user) => user?.userId === u?._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PotentialChat;
