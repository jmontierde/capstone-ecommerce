import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_SHIPPING_INFO,
  CLEAR_CART,
  GET_CHECKOUT,
} from "../constants/cartConstant";

const url = "http://localhost:7000";

export const addItemToCart =
  (id, quantity, stickerSize, stickerPosition) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`${url}/api/v1/product/${id}`);

    let payload = {
      productId: data.product.productId,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity,
    };

    // Check if the product being added is a sticker
    if (data.product.category === "655dfb180fcf137bcb9e7586") {
      payload = {
        ...payload,
        stickerSize,
        stickerPosition,
      };
    }

    dispatch({
      type: ADD_TO_CART,
      payload,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const getCheckout =
  (id, quantity, stickerSize, stickerPosition) =>
  async (dispatch, getState) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${url}/api/v1/product/${id}`, config);

    dispatch({
      type: GET_CHECKOUT,
      payload: {
        product: data.product.productId,
        name: data.product.name,
        price: data.product.price + 30,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
        stickerSize,
        stickerPosition,
      },
    });

    // localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

export const removeItemFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_ITEM_CART,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};

export const clearCart = () => (dispatch) => {
  dispatch({
    type: CLEAR_CART,
  });
  localStorage.removeItem("cartItems");
};
