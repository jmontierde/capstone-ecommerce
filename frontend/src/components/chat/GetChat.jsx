import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { createChat, getUserChats, getChat } from "../../actions/chatActions";

import { createMessages, getMessages } from "../../actions/messagesActions";
const GetChat = () => {
  const dispatch = useDispatch();

  const { newChat } = useSelector((state) => state.createChat);
  const { chat } = useSelector((state) => state.chat);
  const { chats, loading, error } = useSelector((state) => state.userChats);

  // const { createMessages } = useSelector((state) => state.createMessages);

  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");

  const [chatId, setChatId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [text, setText] = useState("");

  const handleMessages = () => {
    console.log("Before dispatching createMessages");
    dispatch(createMessages(chatId, senderId, text));
    console.log("After dispatching createMessages");
  };
  const handleCreateChat = () => {
    console.log("First ID:", firstId);
    console.log("Second ID:", secondId);
    dispatch(createChat(firstId, secondId));
  };

  useEffect(() => {
    dispatch(getUserChats("64ac4948876c6f8284770b60"));
    dispatch(getChat("64ac4948876c6f8284770b60", "64d5d52de9ed0db508b1f859"));
    dispatch(getMessages("64ac4948876c6f8284770b60"));
  }, [dispatch]);

  return (
    <div>
      <h1>Chat Creation</h1>
      <div>
        <input
          type="text"
          placeholder="First ID"
          value={firstId}
          onChange={(e) => setFirstId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Second ID"
          value={secondId}
          onChange={(e) => setSecondId(e.target.value)}
        />
        <button onClick={handleCreateChat}>Create newChat</button>
      </div>
      <div>
        <h1>User Chats</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <h2>Chats List</h2>
            <ul>
              {chats.map((chat) => (
                <li key={chat._id}>{chat._id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MESSAGES */}

      <div>
        <input
          type="text"
          placeholder="Chat Id"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sender Id"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={handleMessages}>Messages</button>
      </div>
    </div>
  );
};

export default GetChat;
