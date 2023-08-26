import {
  CREATE_MESSAGES_FAIL,
  CREATE_MESSAGES_REQUEST,
  CREATE_MESSAGES_SUCCESS,
  CREATE_MESSAGES_RESET,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  ADD_MESSAGE,
  RECEIVE_MESSAGE,
  CLEAR_ERRORS,
} from "../constants/messageConstants";

export const createMessagesReducer = (state = { newMessages: {} }, action) => {
  switch (action.type) {
    case CREATE_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_MESSAGES_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        newMessages: action.payload.newMessages,
      };

    case CREATE_MESSAGES_FAIL:
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

export const getMessagesReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload,
      };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case GET_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
