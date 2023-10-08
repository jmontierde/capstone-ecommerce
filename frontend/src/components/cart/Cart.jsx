import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import CheckoutSteps from "./CheckoutSteps";
const Cart = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  // const handleQuantityChange = (event) => {
  //   setQuantity(parseInt(event.target.value));
  // };

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  console.log("CART ITEM", cartItems);

  const handleQuantityChange = (id, newQuantity, stock) => {
    if (newQuantity < 1 || newQuantity > stock) {
      return; // Don't update if the new quantity is invalid.
    }
    dispatch(addItemToCart(id, newQuantity));
  };

  const handleAddQuantity = (id, quantity, stock) => {
    const newQuantity = quantity + 1;

    if (newQuantity <= stock) {
      dispatch(addItemToCart(id, newQuantity));
    }
  };

  const handleMinusQuantity = (id, quantity) => {
    const newQuantity = quantity - 1;
    if (newQuantity >= 1) {
      dispatch(addItemToCart(id, newQuantity));
    }
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <CheckoutSteps />
      <>
        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <h2 className="text-center font-bold text-4xl">
              Your Cart is Empty
            </h2>
          </div>
        ) : (
          <>
            <div className="container mx-auto my-6">
              {/* <h1>
                Cart:
                {cartItems.length > 1
                  ? `${cartItems.length} items`
                  : `${cartItems.length} item`}{" "}
              </h1> */}
              <h1 className="font-bold text-4xl my-12">Shopping Cart</h1>
              <div className="flex sm:flex-col lg:flex-row gap-16">
                <div className="flex flex-col lg:w-2/3">
                  <hr className="h-px mb-3" />
                  {/* For Product */}
                  {cartItems.map((cart) => (
                    <>
                      <div
                        className="flex justify-between space-x-32 items-start w-full py-6 gap-1"
                        key={cart.name}
                      >
                        <div className="w-4/6  flex ">
                          <img
                            src={cart.image}
                            className="w-1/2 h-48 mx-auto bg-[#F7F7F7]"
                          />
                          <div className="flex flex-col px-6 w-1/2 justify-between ">
                            <p>{cart.name}</p>
                            <h4>₱{cart.price}</h4>
                          </div>
                        </div>
                        <div className="space-x-1  p-3 flex items-center justify-between  rounded-sm  border border-[#171717] mx-auto ">
                          <button
                            className="px-3 py-1  "
                            onClick={() =>
                              handleMinusQuantity(
                                cart.product,
                                cart.quantity,
                                cart.price
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            className="w-12 text-center bg-transparent outline-none appearance-none"
                            type="number"
                            value={cart.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                cart.product,
                                parseInt(e.target.value),
                                cart.stock
                              )
                            }
                            min="1"
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                              appearance: "textfield",
                            }}
                          />
                          <button
                            className="px-3 py-1 "
                            onClick={() =>
                              handleAddQuantity(
                                cart.product,
                                cart.quantity,
                                cart.stock,
                                cart.price
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                            alt="delete"
                            className="w-8 cursor-pointer ml-auto"
                            onClick={() => removeCartItemHandler(cart.product)}
                          />
                        </svg>
                      </div>
                      <hr className="h-px mb-3 bg-gray-200 border-0 dark:bg-gray-700" />
                    </>
                  ))}
                </div>
                {/* Checkout */}
                <div className="lg:w-1/3 h-full space-y-6 rounded-lg p-6 bg-[#F9FAFB]">
                  <h4>Order summary</h4>
                  {/* <div className="flex justify-between">
                    <h5>Sub Total:</h5>
                    <p></p>
                  </div> */}
                  <div className="flex justify-between">
                    <h5>Order total:</h5>
                    <p>
                      ₱
                      {cartItems
                        .reduce(
                          (acc, cart) => acc + cart.quantity * cart.price,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={checkoutHandler}
                    className="bg-[#4F46E5] w-full text-white rounded py-3 px-6 my-6"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default Cart;
