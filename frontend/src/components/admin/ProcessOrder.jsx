import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
} from "../../actions/orderActions";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

import { useParams } from "react-router-dom";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, order = {} } = useSelector((state) => state.orderDetails);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;
  const { error, isUpdated } = useSelector((state) => state.order);

  const orderId = useParams().id;

  console.log("TEST ORDER ID", orderId);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isUpdated, orderId]);

  const updateOrderHandler = (id) => {
    const formData = new FormData();
    formData.set("status", status);

    dispatch(updateOrder(id, formData));
  };

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  return (
    <div className="flex ">
      <Sidebar />
      <div className="container mx-auto px-6 space-x-6 w-10/12">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold my-5">Order # {order._id}</h1>

          <h4 className="text-2xl">Shipping Info</h4>
          <div className="pl-6 py-6">
            <p>
              <b>Email:</b> {user && `${user.email}`}
            </p>
            <p>
              <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
            </p>
            <p>
              <b>Address:</b>
              {shippingDetails}
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

            <h4 className="my-4 font-bold">Stripe ID</h4>
            <p className="font-semibold">{paymentInfo && paymentInfo.id}</p>

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

          <div className="flex flex-col justify-between items-center mr-auto text-center ">
            <div className="flex justify-around items-center mx-auto w-full text-xl font-semibold mt-3">
              <h1 className="w-1/6">Products</h1>
              <h1 className="w-1/6">Product Name</h1>
              <h1 className="w-1/6">Price</h1>
              <h1 className="w-1/6">Quantity</h1>
            </div>
            {orderItems &&
              orderItems.map((item) => (
                <div
                  key={item.product}
                  className="space-y-3 my-6 flex justify-around items-center w-full"
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

          <div className="my-6">
            <h4 className="my-4 text-xl">Status</h4>

            <div className="">
              <select
                className="border border-[#000] py-2 my-1 px-8 bg-[#fff]"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Order Ready">Order Ready</option>
                <option value="In Transit">In Transit</option>
                <option value="Out of Delivery">Out of Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              className="bg-[#2e69a8] rounded py-2 my-3 text-white px-8"
              onClick={() => updateOrderHandler(order._id)}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessOrder;
