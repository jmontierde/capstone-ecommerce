import React from 'react'
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS
  } from '../constants/productConstants';
  
  export const productsReducer = (state = { loading: false, products: [] }, action) => {
    switch (action.type) {
      case ALL_PRODUCTS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case ALL_PRODUCTS_SUCCESS:
        return {
          loading: false,
          products: action.payload.products,
          productsCount: action.payload.productsCount
        };
      case ALL_PRODUCTS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };