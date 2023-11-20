import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_RESET,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_RESET,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
  REFUND_ORDER_REQUEST,
  REFUND_ORDER_SUCCESS,
  REFUND_ORDER_FAIL,
  REFUND_ORDER_RESET,
  ALL_REFUND_REQUEST,
  ALL_REFUND_SUCCESS,
  ALL_REFUND_FAIL,
  UPDATE_REFUND_REQUEST,
  DELETE_REFUND_SUCCESS,
  UPDATE_REFUND_FAIL,
  DELETE_REFUND_FAIL,
  UPDATE_REFUND_RESET,
  DELETE_REFUND_RESET,
  UPDATE_REFUND_SUCCESS,
  VERIFY_ORDER_REQUEST,
  VERIFY_ORDER_SUCCESS,
  VERIFY_ORDER_FAIL,
  VERIFY_ORDER_RESET,
} from "../constants/orderConstants";
import { CLEAR_ERRORS_REDUCER } from "../constants/userConstant";

export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_ORDER_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case CREATE_ORDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return {
        loading: true,
      };

    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case MY_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        loading: true,
      };

    case ALL_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        totalAmount: action.payload.totalAmount,
      };

    case ALL_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_REQUEST:
    case DELETE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_ORDER_FAIL:
    case DELETE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ORDER_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_ORDER_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case VERIFY_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case VERIFY_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };

    case VERIFY_ORDER_RESET:
      return {
        ...state,
        success: false,
        error: null,
      };

    case VERIFY_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Refund
export const createRefundOrderReducer = (state = { refund: {} }, action) => {
  console.log("State Refund", state);
  switch (action.type) {
    case REFUND_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REFUND_ORDER_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        refund: action.payload.refund,
      };

    case REFUND_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case REFUND_ORDER_RESET:
      return {
        ...state,
        success: false,
      };

    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allRefundReducer = (state = { refunds: [] }, action) => {
  switch (action.type) {
    case ALL_REFUND_REQUEST:
      return {
        loading: true,
      };

    case ALL_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        refunds: action.payload.refunds,
      };

    case ALL_REFUND_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const refundReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_REFUND_REQUEST:
    case DELETE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_REFUND_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_REFUND_FAIL:
    case DELETE_REFUND_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REFUND_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_REFUND_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case CLEAR_ERRORS_REDUCER:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
