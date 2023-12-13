import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
} from "../../actions/orderActions";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import { Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // Add paymentStatus state

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

  console.log("orderItemsorderItemsorderItemsorderItems", orderItems);

  const TABLE_HEAD = [
    "Product",
    "Quantity",
    "Price",
    ...(orderItems &&
    orderItems.length > 0 &&
    orderItems.some((item) => item.stickerPosition && item.stickerSize)
      ? ["Sticker Position", "Sticker Size", "Suggestion"]
      : []),
  ];

  const orderId = useParams().id;

  console.log("orderId", orderId);

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
    if (orderStatus === "Delivered") {
      // Allow updating paymentStatus
      if (paymentStatus !== "") {
        const formData = new FormData();
        formData.set("orderStatus", orderStatus);
        formData.set("paymentStatus", paymentStatus); // Include paymentStatus in the form data

        dispatch(updateOrder(id, formData));
      } else {
        alert.error(
          "Payment status is required when order status is Delivered."
        );
      }
    } else {
      // Order status is not "Delivered," allow updating both status fields
      const formData = new FormData();
      formData.set("orderStatus", status);
      formData.set("paymentStatus", paymentStatus); // Include paymentStatus in the form data

      dispatch(updateOrder(id, formData));
    }
  };

  console.log("USER AA", user);
  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  console.log("ORDERRRR", order);

  return (
    <div className="flex bg-[#121212] py-6 text-[#efefef]">
      <div className="container mx-auto px-6 space-x-6 w-10/12 mt-20">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl font-bold my-5">Order # {order.orderId}</h1>

          <h4 className="text-lg">Shipping Info</h4>
          <div className="pl-6 py-6">
            <p>
              <b>Name:</b> {user && `${user.firstName} ${user.lastName}`}
            </p>
            <p>
              <b>Phone: </b> {shippingInfo && ` ${shippingInfo.phoneNo}`}
            </p>
            <p>
              <b>Address: </b>
              {shippingDetails}
            </p>
            <p>
              <b>Amount:</b> ₱{totalPrice}
            </p>
          </div>

          <hr />

          <h4 className="text-lg mt-4">Payment</h4>
          <div className="ml-6 my-6">
            {order.paymentMethod === "CARD" ? (
              <p className={isPaid ? "text-green-500" : "text-red-500"}>
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>
            ) : (
              <p
                className={
                  order.paymentStatus === "Paid"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                <b>{order.paymentStatus}</b>
              </p>
            )}

            {order.paymentMethod === "CARD" ? (
              <>
                <h4 className="my-4 font-bold">Reference ID</h4>
                <p className="font-semibold">{paymentInfo && paymentInfo.id}</p>
              </>
            ) : (
              <span></span>
            )}

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
          <h4 className="text-lg my-3">Order Items:</h4>

          <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-fixed text-left ">
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
                {orderItems &&
                  orderItems.map((item, index) => {
                    const isLast = index === orderItems.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";
                    console.log("orderItemsorderItems", item);
                    return (
                      <tr key={item.product}>
                        <td className={`${classes}  flex flex-col space-y-3`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-48 h-48 p-6 bg-[#F8F8F8]"
                          />
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.quantity}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <p>₱{item.price}</p>
                          </Typography>
                        </td>
                        {item.stickerPosition && item.stickerSize && (
                          <>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {item.stickerPosition}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {item.stickerSize}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {item.suggestion}
                              </Typography>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Card>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
