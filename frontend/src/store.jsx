import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// Second

import {productsReducer, productDetailsReducer} from './reducers/productReducers'
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    // sort: sortProducts
});

const initialState = {};

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))
export default store;