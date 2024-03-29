import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,

  // UPDATE PROFILE
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_FAIL,

  // UPDATE PASSWORD
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_FAIL,
  NEW_PASSWORD_SUCCESS,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  //Update User
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_RESET,
  UPDATE_USER_FAIL,
  //Delete User
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,
  DELETE_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REMOVE_USER,
  CLEAR_ERRORS,
  VERIFY_USER_REQUEST,
  VERIFY_USER_SUCCESS,
  VERIFY_USER_FAIL,
  REGISTER_USER_SUCCESS_PENDING_VERIFICATION,
  CLEAR_ERRORS_REDUCER,
  // GET_TERMS_REQUEST,
  // GET_TERMS_SUCCESS,
  // GET_TERMS_FAIL,
} from "../constants/userConstant";

//Login
const url = "https://vapingsidewalk-server.onrender.com";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // const token = data.token

    const config = {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${localStorage.setItem('token')}`,
      },
    };
    const { data } = await axios.post(
      `${url}/api/v1/login/`,
      { email, password },
      config
    );

    localStorage.setItem("token", data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    console.log("Error message from sss:", error.response.data);
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data,
    });
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/register`,
      userData,
      config
    );

    // console.log("REGISTER DATA", data);
    // dispatch({
    //   type: REGISTER_USER_SUCCESS_PENDING_VERIFICATION,
    //   payload: data.user,
    // });
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    console.log("REGISTER ERRORaa", error.response.data.message.message);
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message.message,
    });
  }
};

// Verify User
export const verifyUser = (userId, verificationStatus) => async (dispatch) => {
  try {
    console.log("Verifying user:", userId, "with status:", verificationStatus);
    dispatch({ type: VERIFY_USER_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/admin/verify/${userId}`,
      { verificationStatus },
      config
    );

    console.log("VERIFCATION STATUS USER ID ", userId);

    console.log("VERIFCATION STATUS", verificationStatus);
    console.log("VERIFCATION DATA", data);

    dispatch({
      type: VERIFY_USER_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: VERIFY_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: LOGOUT_SUCCESS });
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/me`, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/me/update`,
      userData,
      config
    );

    console.log("USERDATA", data);

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    console.log("ERROR ACTION", error.response.data.error);
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.error,
    });
  }
};

// Update password
// Update password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/password/update`,
      passwords,
      config
    );
    console.log("Response data:", data);

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // console.log("Error message from API:", error);

    if (error.response) {
      // If the error has a response, it means it's a server error
      const response = error.response;
      if (response.status === 400) {
        // Handle specific error codes, such as 400 (Bad Request)
        if (
          response.data &&
          response.data.message === "Old password is incorrect"
        ) {
          // Handle the case where the old password is incorrect
          // You might want to display an error message to the user
          dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: "Old password is incorrect",
          });
          console.log("res");
        } else {
          // Handle other 400 errors here
          dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: "An error occurred while updating the password",
          });
        }
      } else {
        // Handle other status codes (e.g., 401 for unauthorized)
        // This is where you don't log the user out but handle the error appropriately
        dispatch({
          type: UPDATE_PASSWORD_FAIL,
          payload: "An error occurred while updating the password",
        });
      }
    } else {
      // Handle network errors (e.g., server is down, no internet connection)
      // This is where you don't log the user out but handle the error appropriately
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: "Network error occurred",
      });
    }
  }
};

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${url}/api/v1/password/forgot`,
      email,
      config
    );

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `${url}/api/v1/password/reset/${token}`,
      JSON.stringify(passwords),
      config
    );

    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Logout User
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    await axios.get(`${url}/api/v1/logout`);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_SUCCESS,
      payload: error.response.data.message,
    });
  }
};

// ADMIN
// Get all users
export const allUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/admin/users`, config);

    console.log("ALL USERS ACTION", data);

    dispatch({
      type: ALL_USERS_SUCCESS,
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${url}/api/v1/admin/user/${id}`,
      userData,
      config
    );

    console.log("DAta", data);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${url}/api/v1/admin/user/${id}`, config);
    console.log("get user details data", data);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${url}/api/v1/admin/user/${id}`,
      config
    );

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const removeUser = (userId) => {
  return {
    type: REMOVE_USER,
    payload: userId,
  };
};

// export const termsAndContions = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_TERMS_REQUEST });

//     const token = localStorage.getItem("token");

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     const { data } = await axios.get(
//       "${url}/api/v1/terms",
//       config
//     );

//     console.log("TERMS", data);

//     dispatch({
//       type: GET_TERMS_SUCCESS,
//       payload: data.content,
//     });
//   } catch (error) {
//     dispatch({
//       type: GET_TERMS_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export const clearErrorsReducer = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS_REDUCER,
  });
};
