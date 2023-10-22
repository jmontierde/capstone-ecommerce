import React from "react";

// First
import {
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  NEW_CATEGORY_RESET,
  NEW_CATEGORY_FAIL,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_RESET,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_RESET,
  UPDATE_CATEGORY_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_RESET,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_RESET,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_RESET,
  UPDATE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_RESET,
  NEW_REVIEW_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  GET_RELATED_PRODUCTS_REQUEST,
  GET_RELATED_PRODUCTS_SUCCESS,
  GET_RELATED_PRODUCTS_FAIL,
} from "../constants/productConstants";
import {
  ADD_TO_WISHLIST_FAIL,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_RESET,
  ADD_TO_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAIL,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_RESET,
  REMOVE_FROM_WISHLIST_SUCCESS,
} from "../constants/wishlistConstant";
import { CLEAR_ERRORS_REDUCER } from "../constants/userConstant";

export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
    case ADMIN_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      };

    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.productsCount,
        resPerPage: action.payload.resPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
        minPrice: action.payload.minPrice, // Update minPrice
        maxPrice: action.payload.maxPrice, // Update maxPrice
      };

    case ADMIN_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload,
      };

    case ALL_PRODUCTS_FAIL:
    case ADMIN_PRODUCTS_FAIL:
      return {
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

//Added Category.
export const categoriesReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };

    case GET_CATEGORIES_FAIL:
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

export const categoryReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_CATEGORY_REQUEST:
    case UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_CATEGORY_FAIL:
    case UPDATE_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_CATEGORY_RESET:
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

//
export const newCategoryReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case NEW_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        category: action.payload.category,
      };

    case NEW_CATEGORY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case NEW_CATEGORY_RESET:
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

// Product Details
export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      };

    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
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

export const relatedProductsReducer = (
  state = { relatedProducts: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case GET_RELATED_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_RELATED_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        relatedProducts: action.payload,
        error: null,
      };

    case GET_RELATED_PRODUCTS_FAIL:
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

export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };

    case NEW_PRODUCT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case NEW_PRODUCT_RESET:
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

export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
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

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      };

    case NEW_REVIEW_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case NEW_REVIEW_RESET:
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

export const productReviewsReducer = (state = { review: [] }, action) => {
  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_REVIEWS_SUCCESS:
      return {
        loading: false,
        reviews: action.payload,
      };

    case GET_REVIEWS_FAIL:
      return {
        ...state,
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

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case DELETE_REVIEW_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REVIEW_RESET:
      return {
        ...state,
        isDeleted: false,
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

export const newWishlistReducer = (state = { wishlist: {} }, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_TO_WISHLIST_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        wishlist: action.payload.wishlist,
      };

    case ADD_TO_WISHLIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TO_WISHLIST_RESET:
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

export const wishlistReducer = (state = { wishlist: [] }, action) => {
  switch (action.type) {
    case GET_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        wishlist: action.payload,
      };

    case GET_WISHLIST_FAIL:
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

export const deleteWishlistReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_FROM_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case REMOVE_FROM_WISHLIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case REMOVE_FROM_WISHLIST_RESET:
      return {
        ...state,
        isDeleted: false,
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
