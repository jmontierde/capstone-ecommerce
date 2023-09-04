import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Calculate Order Prices
  const itemsPrice = cartItems.reduce(
    (acc, cart) => acc + cart.price * cart.quantity,
    0
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  // Maybe add later
  // const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  // const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);0
  const totalPrice = (itemsPrice + shippingPrice).toFixed(2);
  const processToPayment = () => {
    const data = {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice,
      // taxPrice,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <>
      <div className="container flex flex-col mx-auto px-12">
        <CheckoutSteps />
        {cartItems.map((cart) => (
          <div className="flex justify-between items-center" key={cart.name}>
            <div className="flex items-center w-1/2">
              <img src={cart.image} alt={cart.name} className="w-1/4" />
              <p className="font-semibold text-lg">{cart.name}</p>
            </div>
            <div className="flex justify-around text-lg  w-1/2">
              <p>{cart.quantity}</p>
              <p>{cart.price}</p>
            </div>
          </div>
        ))}
        <hr className=" outline-dashed outline-1 " />
        <div className="flex container my-12">
          <div className="w-4/6   p-6  space-y-3">
            <h4 className="font-bold text-xl">Shipping Information</h4>
            <div className="flex flex-col">
              <p className="font-bold">
                Name: <span className="font-semibold">{user.name}</span>
              </p>
              <p className="font-bold">
                Phone:{" "}
                <span className="font-semibold">{shippingInfo.phoneNo}</span>
              </p>
              <p className="font-bold">
                Address:{" "}
                <span className="font-semibold">
                  {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                </span>
              </p>
            </div>
          </div>
          {/* Payment */}
          <div className="w-2/6 flex flex-col">
            <div className=" px-12 py-6 bg-[#FFF2F0]  rounded-2xl">
              <div>
                <div className="flex justify-between font-semibold">
                  <p>₱Subtotal</p>
                  <p>₱{itemsPrice}</p>
                </div>
                <div className="flex justify-between font-semibold">
                  <p>Shipping fee</p>
                  <p>₱{shippingPrice}</p>
                </div>
                <div className="flex mt-6 justify-between text-[#EE8576] font-bold bg">
                  <p>Total</p>
                  <p>₱{totalPrice}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 ml-auto">
              <button
                className="bg-[#f0c0b4] p-3 rounded text-[#000] font-semibold"
                onClick={processToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
