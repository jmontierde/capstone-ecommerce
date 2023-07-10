import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderActions";
const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">My Orders</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center my-6">
          <table className="table-fixed w-2/3 h-32">
            <thead className="bg-[#ECEFF1]">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Num of Items</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">
                    {order.orderItems.length}
                  </td>
                  <td className="border px-4 py-2">{order.totalPrice}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`${
                        order.orderStatus === "Delivered"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <Link to={`/order/${order._id}`}>
                      <img
                        src="/images/eye-solid.svg"
                        alt="View Order"
                        className="w-6 h-6 mx-auto"
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
