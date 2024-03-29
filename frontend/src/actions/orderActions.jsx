import axios from "axios";

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
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
  REFUND_ORDER_REQUEST,
  REFUND_ORDER_SUCCESS,
  REFUND_ORDER_FAIL,
  ALL_REFUND_REQUEST,
  ALL_REFUND_SUCCESS,
  ALL_REFUND_FAIL,
  DELETE_REFUND_REQUEST,
  DELETE_REFUND_SUCCESS,
  DELETE_REFUND_FAIL,
  UPDATE_REFUND_REQUEST,
  UPDATE_REFUND_SUCCESS,
  UPDATE_REFUND_FAIL,
  VERIFY_ORDER_REQUEST,
  VERIFY_ORDER_SUCCESS,
  VERIFY_ORDER_FAIL,
} from "../constants/orderConstants";
import { DELETE_REVIEW_FAIL } from "../constants/productConstants";
import { CLEAR_ERRORS_REDUCER } from "../constants/userConstant";
const url = "https://vapingsidewalk-server.onrender.com";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("token");
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${url}/api/v1/order/new`, order, config);

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response
        ? error.response.data.message
        : "An error occurred while creating the order.",
    });
  }
};

export const verifyOrder = (orderId, status) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_ORDER_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/order/verify/${orderId}`,
      { adminVerificationStatus: status },
      config
    );

    console.log("data Verify Order", data);

    dispatch({
      type: VERIFY_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("error verify", error.response.data.message);
    dispatch({
      type: VERIFY_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get curretly logged in user orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/orders/me`, config);

    console.log("MYORDERS", data.orders);

    dispatch({
      type: MY_ORDERS_SUCCESS,
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get order details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/order/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get all orders - ADMIN
export const allOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${url}/api/v1/admin/orders`, config);

    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// update order
export const updateOrder = (id, refundData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/admin/order/${id}`,
      refundData,
      config
    );

    console.log("Data UPDATE", data);

    dispatch({
      type: UPDATE_ORDER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${url}/api/v1/admin/order/${id}`,
      config
    );

    dispatch({
      type: DELETE_ORDER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const createRefund = (refundData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    dispatch({ type: REFUND_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/order/refund`,
      refundData,
      config
    );

    console.log("REFUND DATA", data);

    dispatch({
      type: REFUND_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REFUND_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get all refunds - ADMIN
export const allRefund = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_REFUND_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${url}/api/v1/admin/order/refunds`,
      config
    );

    console.log("A", data);

    dispatch({
      type: ALL_REFUND_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_REFUND_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteRefund = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REFUND_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${url}/api/v1/admin/refund/${id}`,
      config
    );

    dispatch({
      type: DELETE_REFUND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REFUND_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const updateRefund = (id, refundData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    dispatch({ type: UPDATE_REFUND_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/admin/refund/${id}`,
      refundData,
      config
    );

    console.log("UPDATE REFUND", data);

    dispatch({
      type: UPDATE_REFUND_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_REFUND_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS_REDUCER,
  });
};
