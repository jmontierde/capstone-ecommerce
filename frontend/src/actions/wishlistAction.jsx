import axios from "axios";
import {
  ADD_TO_WISHLIST_FAIL,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  CLEAR_ERRORS,
  GET_WISHLIST_FAIL,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAIL,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
} from "../constants/wishlistConstant";
const url = "http://localhost:7000";

// Add a product to the user's wishlist
export const addToWishlist = (productId) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_WISHLIST_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/wishlist/add/${productId}`, // Adjust the API endpoint as needed
      {},
      config
    );

    console.log("data", data);

    dispatch({
      type: ADD_TO_WISHLIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_TO_WISHLIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getWishlist = () => async (dispatch) => {
  try {
    dispatch({ type: GET_WISHLIST_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${url}/api/v1/wishlist`, config);

    dispatch({
      type: GET_WISHLIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_WISHLIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Remove a product from the user's wishlist
export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_WISHLIST_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${url}/api/v1/wishlist/remove/${productId}`, // Adjust the API endpoint as needed
      config
    );

    dispatch({
      type: REMOVE_FROM_WISHLIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_WISHLIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
