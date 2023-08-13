import React from "react";
import { createMessages, getMessages } from "../../actions/messagesActions";

import { useSelector, useDispatch } from "react-redux";

const Chatbox = (messages) => {
  const dispatch = useDispatch();

  //   const messages = useSelector((state) => state.getMessages);

  return <div>Chatbosx</div>;
};

export default Chatbox;
