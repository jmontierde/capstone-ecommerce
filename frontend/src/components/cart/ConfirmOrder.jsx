import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const TABLE_HEAD = ["Product", "Quantity", "Price"];
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
      <div className="container flex flex-col mx-auto ">
        <CheckoutSteps />
        <Card className="h-full w-full my-12 mx-6">
          <table className="w-full min-w-max table-fixed text-center">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cart, index) => {
                const isLast = index === cartItems.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={cart.name}>
                    <td className={`${classes} flex `}>
                      <img
                        src={cart.image}
                        alt={cart.cart}
                        className="w-48 h-48 "
                      />
                      <p className="text-sm text-center flex items-end mb-6">
                        {cart.name}
                      </p>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {cart.quantity}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {cart.price}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <hr />
        <div className="flex container px-6 my-12">
          <div className="w-4/6   space-y-3">
            <h4 className=" text-xl font-semibold">Shipping Information</h4>
            <div className="flex flex-col">
              <p className="">
                Name:{" "}
                <span className="">
                  {user.firstName}
                  {""} {user.lastName}
                </span>
              </p>
              <p className="">
                Phone: <span className="">{shippingInfo.phoneNo}</span>
              </p>
              <p className="">
                Address:{" "}
                <span className="">
                  {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                </span>
              </p>
            </div>
          </div>
          {/* Payment */}
          <div className="w-2/6 flex flex-col">
            <div className=" px-12 py-6 bg-[#484487]  rounded-2xl">
              <div>
                <div className="flex justify-between text-[#fff]">
                  <p>Subtotal</p>
                  <p>₱{itemsPrice}</p>
                </div>
                <div className="flex justify-between text-[#fff]">
                  <p>Shipping fee</p>
                  <p>₱{shippingPrice}</p>
                </div>
                <div className="flex mt-6 justify-between text-[#fff]">
                  <p>Total</p>
                  <p>₱{totalPrice}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 ml-auto">
              <button
                className="bg-[#4F46E5] p-3 rounded text-[#fff] "
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
