import axios from 'axios';
// 3rd
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS
    } from '../constants/productConstants'

    export const getProducts = () => async(dispatch) => { 
        try {
            dispatch({type: ALL_PRODUCTS_REQUEST})
            //send the request to backend
            const {data} =  await axios.get('http://localhost:7000/api/v1/products')
    
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


export const getProductDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`http://localhost:7000/api/v1/product/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
        
        console.log(data)

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async(dispatch) => { 
    dispatch({
        type: CLEAR_ERRORS
    })
}
