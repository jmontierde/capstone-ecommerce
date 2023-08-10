import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMessagesAction } from "../../actions/chatAction";

const GetChat = () => {
  const { user } = useSelector((state) => state.auth);
  const { loading, message, error } = useSelector((state) => state.messenger);

  console.log("USER", user._id);
  console.log("message", message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesAction(user._id));
  }, [dispatch]);

  return <div>{message.text}</div>;
};

export default GetChat;
