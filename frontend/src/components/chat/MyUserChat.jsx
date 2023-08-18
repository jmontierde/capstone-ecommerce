import React, { useState } from "react";

const MyUserChat = ({ users, chat, user }) => {
  //   const recipientId = chat?.members.find((id) => id !== user?._id);

  const recipientId = chat?.members.find((id) => id !== user._id);

  // Find the recipient user object using the ID
  const recipientUser = users.find((u) => u._id === recipientId);

  //   console.log("REC USER",recipientUser)

  return (
    <>
      <div className="flex flex-col my-3">
        <h1>{recipientUser?.name}</h1>

        <p>Text Message</p>
      </div>
    </>
  );
};

export default MyUserChat;
