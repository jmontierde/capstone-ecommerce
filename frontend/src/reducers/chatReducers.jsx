import {
  CREATE_CHATS_SUCCESS,
  CREATE_CHATS_REQUEST,
  CREATE_CHATS_FAIL,
  CREATE_CHATS_RESET,
  GET_CHAT_FAIL,
  GET_CHAT_REQUEST,
  GET_CHAT_SUCCESS,
  GET_FINDCHAT_REQUEST,
  GET_FINDCHAT_SUCCESS,
  GET_FINDCHAT_FAIL,
  GET_USER_CHATS_FAIL,
  GET_USER_CHATS_REQUEST,
  GET_USER_CHATS_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/chatConstants";

export const createChatReducer = (state = { newChat: {} }, action) => {
  switch (action.type) {
    case CREATE_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_CHATS_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        newChat: action.payload.newChat,
      };

    case CREATE_CHATS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userChatsReducer = (state = { chats: [] }, action) => {
  switch (action.type) {
    case GET_USER_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload,
      };

    case GET_USER_CHATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const chatReducer = (state = { chat: [] }, action) => {
  switch (action.type) {
    case GET_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };

    case GET_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
