import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// Second

import {
  productsReducer,
  productDetailsReducer,
  productReducer,
  newProductReducer,
  newReviewReducer,
  reviewReducer,
  productReviewsReducer,
  categoriesReducer,
  categoryReducer,
  newCategoryReducer,
  relatedProductsReducer,
  newWishlistReducer,
  wishlistReducer,
  deleteWishlistReducer,
} from "./reducers/productReducers";
import {
  authReducer,
  userReducer,
  forgotPasswordReducer,
  allUsersReducer,
  userDetailsReducer,
  removeUserReducer,
  // termsReducer,
} from "./reducers/userReducers";

import { cartReducer, checkoutReducer } from "./reducers/cartReducers";

import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  allOrdersReducer,
  orderReducer,
  createRefundOrderReducer,
  allRefundReducer,
  refundReducer,
} from "./reducers/orderReducers";

import {
  chatReducer,
  createChatReducer,
  userChatsReducer,
} from "./reducers/chatReducers";
import {
  createMessagesReducer,
  getMessagesReducer,
} from "./reducers/messageReducers";
import {
  createTermReducer,
  termReducer,
  termsReducer,
} from "./reducers/termsReducers";

const reducer = combineReducers({
  newWishlist: newWishlistReducer,
  getWishlist: wishlistReducer,
  deleteWishlist: deleteWishlistReducer,
  relatedProducts: relatedProductsReducer,
  checkout: checkoutReducer,
  terms: termsReducer,
  term: termReducer,
  newTerm: createTermReducer,
  removeUser: removeUserReducer,
  messages: getMessagesReducer,
  createMessages: createMessagesReducer,
  chat: chatReducer,
  userChats: userChatsReducer,
  createChat: createChatReducer,
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productReviews: productReviewsReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  newCategory: newCategoryReducer,
  review: reviewReducer,
  newReview: newReviewReducer,
  auth: authReducer,
  user: userReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  orderDetails: orderDetailsReducer,
  order: orderReducer,
  createRefund: createRefundOrderReducer,
  allRefund: allRefundReducer,
  refund: refundReducer,
});

const initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middlware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlware))
);
export default store;
