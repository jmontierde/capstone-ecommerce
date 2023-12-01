import axios from "axios";
import { combineReducers } from "redux";
import {
  CREATE_MESSAGES_FAIL,
  CREATE_MESSAGES_REQUEST,
  CREATE_MESSAGES_SUCCESS,
  CREATE_MESSAGES_RESET,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  RECEIVE_MESSAGE,
} from "../constants/messageConstants";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
export const createMessages = (chatId, senderId, text) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_MESSAGES_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `https://vapingsidewalk-server.onrender.com/api/v1/messages`,
      { chatId, senderId, text },
      config
    );

    socket.emit("sendMessage", { chatId, senderId, text });

    console.log("CREATE MESSAGES Response", data);
    dispatch({
      type: CREATE_MESSAGES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error in createMessages action:", error);
    dispatch({
      type: CREATE_MESSAGES_FAIL,
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

export const getMessages = (currentChat) => async (dispatch) => {
  try {
    dispatch({ type: GET_MESSAGES_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `https://vapingsidewalk-server.onrender.com/api/v1/messages/${currentChat}`,
      config
    );
    console.log("GET MESSAGES FROM ACTION", data);

    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: data.messages,
    });
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});

export const getMessagesSuccess = (messages) => ({
  type: GET_MESSAGES_SUCCESS,
  payload: messages,
});

export const initRealTimeMessages = () => (dispatch) => {
  console.log("Initializing real-time messages...");
  socket.on("getMessage", (data) => {
    console.log("Received real-time message:", data.message);
    dispatch(receiveMessage(data.messages));
  });
};

// export const initRealTimeMessages = () => (dispatch) => {
//   // Initialize Socket.IO connection
//   socket.on("getMessage", (data) => {
//     dispatch({
//       type: GET_MESSAGES_SUCCESS,
//       payload: [data.message, ...messages],
//     });
//   });
// };
