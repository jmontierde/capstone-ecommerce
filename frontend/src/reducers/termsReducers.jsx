import {
  CREATE_TERMS_REQUEST,
  CREATE_TERMS_SUCCESS,
  CREATE_TERMS_FAIL,
  CREATE_TERMS_RESET,
  GET_TERMS_REQUEST,
  GET_TERMS_SUCCESS,
  GET_TERMS_FAIL,
  DELETE_TERMS_REQUEST,
  DELETE_TERMS_SUCCESS,
  DELETE_TERMS_FAIL,
  DELETE_TERMS_RESET,
  UPDATE_TERMS_REQUEST,
  UPDATE_TERMS_SUCCESS,
  UPDATE_TERMS_FAIL,
  UPDATE_TERMS_RESET,
  CLEAR_ERRORS,
} from "../constants/termsConstant";

const initialState = {
  loading: false,
  success: false,
  error: null,
  term: null,
};
export const createTermReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TERMS_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case CREATE_TERMS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        term: action.payload.termsAndConditions,
      };
    case CREATE_TERMS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_TERMS_RESET:
      return {
        ...state,
        success: false,
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
export const termsReducer = (state = { termsAndConditions: [] }, action) => {
  switch (action.type) {
    case GET_TERMS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_TERMS_SUCCESS:
      return {
        ...state,
        loading: false,
        termsAndConditions: action.payload,
      };
    case GET_TERMS_FAIL:
      return {
        ...state,
        loading: false,
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

export const termReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TERMS_REQUEST:
    case UPDATE_TERMS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_TERMS_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_TERMS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_TERMS_FAIL:
    case UPDATE_TERMS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TERMS_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_TERMS_RESET:
      return {
        ...state,
        isUpdated: false,
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