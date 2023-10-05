import { GET_REVIEWS_FAIL } from "../constants/productConstants";
import {
  GET_TERMS_FAIL,
  GET_TERMS_REQUEST,
  GET_TERMS_SUCCESS,
  DELETE_TERMS_REQUEST,
  DELETE_TERMS_FAIL,
  DELETE_TERMS_SUCCESS,
  DELETE_TERMS_RESET,
  UPDATE_TERMS_FAIL,
  UPDATE_TERMS_REQUEST,
  UPDATE_TERMS_RESET,
  UPDATE_TERMS_SUCCESS,
  CREATE_TERMS_REQUEST,
  CREATE_TERMS_SUCCESS,
  CREATE_TERMS_FAIL,
  CLEAR_ERRORS,
} from "../constants/termsConstant";
import axios from "axios";
const url = "https://vapingsidewalk-backend.onrender.com";

export const createTerms = (title, content) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_TERMS_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/admin/term`,
      { title, content },
      config
    );

    console.log("NEW TERMS AND CONDITIONS", data);

    dispatch({
      type: CREATE_TERMS_SUCCESS,
      payload: data.termsAndConditions,
    });
  } catch (error) {
    dispatch({
      type: CREATE_TERMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getTerms = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TERMS_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/terms`, config);

    console.log("TERMS", data);

    dispatch({
      type: GET_TERMS_SUCCESS,
      payload: data.termsAndConditions,
    });
  } catch (error) {
    dispatch({
      type: GET_TERMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getUserTerms = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TERMS_REQUEST });

    const { data } = await axios.get(`${url}/api/v1/user/terms`);

    console.log("TERMSA", data);

    dispatch({
      type: GET_TERMS_SUCCESS,
      payload: data.termsAndConditions,
    });
  } catch (error) {
    dispatch({
      type: GET_TERMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteTerm = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TERMS_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${url}/api/v1/admin/term/${id}`,
      config
    );

    dispatch({
      type: DELETE_TERMS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_TERMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Product (ADMIN)
export const updateTerm = (id, updatedFields) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    dispatch({ type: UPDATE_TERMS_REQUEST });

    const { data } = await axios.put(
      `${url}/api/v1/admin/term/${id}`, // Properly construct the URL
      updatedFields, // Include the updated fields in the request body
      config
    );

    dispatch({
      type: UPDATE_TERMS_SUCCESS,
      payload: data.updatedTermsAndConditions, // Assuming 'updatedTermsAndConditions' is the response field
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TERMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
