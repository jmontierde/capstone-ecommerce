import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearErrors } from "../../actions/orderActions";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    loading,
    error,
    order = {},
  } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    dispatch(getOrderDetails(id));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  console.log("AAA", order);

  return (
    <div className="container mx-auto px-6 space-x-6 w-3/4">
      <div className="flex flex-col justify-center h-full">
        <h1 className="text-4xl font-bold my-5">Order # {order._id}</h1>

        <h4 className="text-2xl">Shipping Info</h4>
        <div className="pl-6 py-6">
          <p>
            <b>Email:</b> {user && user.email}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
          </p>
          <p>
            <b>Address:</b> {shippingDetails}
          </p>
          <p>
            <b>Amount:</b> {totalPrice}
          </p>
        </div>

        <hr />

        <h4 className="text-2xl mt-4">Payment</h4>
        <div className="ml-6 my-6">
          <p className={isPaid ? "text-green-500" : "text-red-500"}>
            <b>{isPaid ? "PAID" : "NOT PAID"}</b>
          </p>

          <h4 className="my-4">Order Status:</h4>
          <p
            className={
              order.orderStatus &&
              String(order.orderStatus).includes("Delivered")
                ? "text-green-500"
                : "text-red-500"
            }
          >
            <b>{orderStatus}</b>
          </p>
        </div>

        <hr />
        <h4 className="text-2xl my-4">Order Items:</h4>

        <div className="flex flex-col justify-between items-center mr-auto text-center bg-gray-500">
          <div className="flex justify-around items-center mx-auto w-full text-xl font-semibold mt-6">
            <h1 className="w-1/6">Products</h1>
            <h1 className="w-1/6">Product Name</h1>
            <h1 className="w-1/6">Price</h1>
            <h1 className="w-1/6">Quantity</h1>
          </div>
          {orderItems &&
            orderItems.map((item) => (
              <div
                key={item.product}
                className="space-y-3 flex justify-around items-center w-full"
              >
                <img src={item.image} alt={item.name} className="w-1/6" />

                <div className="text-xl w-1/6">
                  <Link to={`/products/${item.product}`}>{item.name}</Link>
                </div>

                <div className="text-xl w-1/6">
                  <p>{item.price}</p>
                </div>

                <div className="text-xl w-1/6">
                  <p>
                    {item.quantity}
                    {item.quantity > 1 ? " Pieces" : " Piece"}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default OrderDetails;
