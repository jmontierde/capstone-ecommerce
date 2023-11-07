import axios from "axios";

import {
  CREATE_CHATS_SUCCESS,
  CREATE_CHATS_FAIL,
  CREATE_CHATS_REQUEST,
  CREATE_CHATS_RESET,
  GET_CHAT_FAIL,
  GET_CHAT_SUCCESS,
  GET_CHAT_REQUEST,
  GET_FINDCHAT_REQUEST,
  GET_FINDCHAT_SUCCESS,
  GET_FINDCHAT_FAIL,
  GET_USER_CHATS_FAIL,
  GET_USER_CHATS_REQUEST,
  GET_USER_CHATS_SUCCESS,
} from "../constants/chatConstants";

export const createChat = (firstId, secondId) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CHATS_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `https://vapingsidewalk-backend.onrender.com/api/v1/chats`,
      { firstId, secondId },
      config
    );

    console.log("CREATE CHAT", data);

    dispatch({
      type: CREATE_CHATS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_CHATS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getUserChats = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_CHATS_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `https://vapingsidewalk-backend.onrender.com/api/v1/chat/${userId}`,
      config
    );

    console.log("GET USER CHAT", data);

    dispatch({
      type: GET_USER_CHATS_SUCCESS,
      payload: data.chats,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_CHATS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getChat = (firstId, secondId) => async (dispatch) => {
  try {
    dispatch({ type: GET_CHAT_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `https://vapingsidewalk-backend.onrender.com/api/v1/chat/find/${firstId}/${secondId}`,
      config
    );

    console.log("GET  CHAT", data);

    dispatch({
      type: GET_CHAT_SUCCESS,
      payload: data.chat,
    });
  } catch (error) {
    dispatch({
      type: GET_CHAT_FAIL,
      payload: error.response.data.message,
    });
  }
};
