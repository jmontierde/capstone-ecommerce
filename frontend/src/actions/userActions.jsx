import axios from 'axios'
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
    CLEAR_ERRORS

} from '../constants/userConstant'


//Login


export const login = (email, password) => async (dispatch) => {
    try{
        dispatch({type: LOGIN_REQUEST})
        
        // const token = data.token

        const config = { 
            headers : {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.setItem('token')}`,
            }
        }
        const {data} = await axios.post('http://localhost:7000/api/v1/login/', {email, password}, config)
        // localStorage.setItem('token', data.token);
        

        console.log(data)
    
        localStorage.setItem('token', data.token);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
   
    }catch(error){
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

// Register user
export const register = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',

            }
        }

        const { data } = await axios.post('http://localhost:7000/api/v1/register', userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

//Load User 
export const loadUser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch({ type: LOGOUT_SUCCESS });
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.get('http://localhost:7000/api/v1/me', config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        });
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        });
    }
};


// Update profile
export const updateProfile = (userData) => async (dispatch) => {

    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        const { data } = await axios.put('http://localhost:7000/api/v1/me/update', {...userData, cookie: token}, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })


    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {


        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const { data } = await axios.put('http://localhost:7000/api/v1/password/update', passwords, config)

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}


//Logout User 
export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('token');
        await axios.get('http://localhost:7000/api/v1/logout')
        dispatch({ type: LOGOUT_SUCCESS });

    } catch (error) {
        dispatch({
            type: LOGOUT_SUCCESS,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async(dispatch) => { 
    dispatch({
        type: CLEAR_ERRORS
    })
}