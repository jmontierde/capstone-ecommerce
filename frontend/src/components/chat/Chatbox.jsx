import React from "react";
import { createMessages, getMessages } from "../../actions/messagesActions";

import { useSelector, useDispatch } from "react-redux";

const Chatbox = (props) => {
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.getMessages);

  console.log("GET MESSAGE", messages);

  return (
    <div>
      Chatbox
      <div>
        <p>a</p>
        <p>b</p>
        <p>c</p>
      </div>
    </div>
  );
};

export default Chatbox;
