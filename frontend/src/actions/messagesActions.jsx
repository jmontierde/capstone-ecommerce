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
} from "../constants/messageConstants";
import { io } from "socket.io-client";

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
      `http://localhost:7000/api/v1/messages`,
      { chatId, senderId, text },
      config
    );

    console.log("CREATE MESSAGES Response", data); // Add this line
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

export const getMessages = (currentChat, socket) => async (dispatch) => {
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
      `http://localhost:7000/api/v1/messages/${currentChat}`,
      config
    );

    dispatch({
      type: GET_MESSAGES_SUCCESS,
      payload: data.messages,
    });

    if (socket) {
      socket.on("getMessage", (newMessage) => {
        dispatch({
          type: GET_MESSAGES_SUCCESS,
          payload: [...data.messages, newMessage],
        });
      });
    }
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_FAIL,
      payload: error.response.data.message,
    });
  }
};

// export const getMessages = (currentChat) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_MESSAGES_REQUEST });

//     const token = localStorage.getItem("token");

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     const { data } = await axios.get(
//       `http://localhost:7000/api/v1/messages/${currentChat}`,
//       config
//     );

//     console.log("GET MESSAGES FROM ACTION", data);

//     dispatch({
//       type: GET_MESSAGES_SUCCESS,
//       payload: data.messages,
//     });
//   } catch (error) {
//     dispatch({
//       type: GET_MESSAGES_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };
