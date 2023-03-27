import axios from 'axios';

import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS
    } from '../constants/productConstants'

export const getProducts = () => async(dispatch) => { 
    try {
        dispatch({type: ALL_PRODUCTS_REQUEST})
        //send the request to backend
        const {data} =  await axios.get('http://localhost:5000/api/v1/products')

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message

        })
    }
}


export const clearErrors = () => async(dispatch) => { 
    dispatch({
        type: CLEAR_ERRORS
    })
}
