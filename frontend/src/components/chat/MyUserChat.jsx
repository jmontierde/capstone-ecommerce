import React, { useState } from "react";

const MyUserChat = ({ users, chat, user, onlineUsers }) => {
  //   const recipientId = chat?.members.find((id) => id !== user?._id);

  const recipientId = chat?.members.find((id) => id !== user._id);

  // Find the recipient user object using the ID
  const recipientUser = users.find((u) => u._id === recipientId);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <>
      <div className="flex flex-col my-3">
        <h1>{recipientUser?.name}</h1>

        {/* <p>{recipientId}</p> */}
        <p>Text Message</p>
        <div>
          <h4>12/12/2023</h4>
          <h4>2</h4>
          <h4
            className={isOnline ? "bg-[#0c3b12] w-3 h-3 rounded-full" : ""}
          ></h4>
        </div>
      </div>
    </>
  );
};

export default MyUserChat;
