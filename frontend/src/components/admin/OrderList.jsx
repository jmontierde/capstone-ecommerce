import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  allOrders,
  deleteOrder,
  clearErrors,
} from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector((state) => state.order);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  useEffect(() => {
    dispatch(allOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order deleted successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isDeleted]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  const deleteSelectedOrders = () => {
    if (selectedOrders.length > 0) {
      selectedOrders.forEach((orderId) => {
        deleteOrderHandler(orderId);
      });
      setSelectedOrders([]);
    } else {
      alert("Please select orders to delete.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">My Orders</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto px-12">
          <Sidebar />
          <div className="flex flex-col w-10/12 h-full justify-center  ">
            <div className="flex justify-start mt-4">
              <button
                className="bg-red-500 text-white px-3 py-2"
                onClick={deleteSelectedOrders}
              >
                Delete Selected Orders
              </button>
            </div>
            <table className="table w-full h-32">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={masterCheckboxChecked}
                      onChange={() => {
                        if (masterCheckboxChecked) {
                          setSelectedOrders([]);
                        } else {
                          setSelectedOrders(orders.map((order) => order._id));
                        }
                        setMasterCheckboxChecked(!masterCheckboxChecked);
                      }}
                    />
                  </th>
                  <th>No</th>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Num of Items</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={
                          masterCheckboxChecked ||
                          selectedOrders.includes(order._id)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order._id]);
                          } else {
                            setSelectedOrders(
                              selectedOrders.filter((id) => id !== order._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{index + 1}</td>
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
                      <div className="flex justify-center items-center space-x-3">
                        <Link to={`/admin/order/${order._id}`}>
                          <img
                            src="/images/eye-solid.svg"
                            alt="View Order"
                            className="w-6 h-6 mx-auto"
                          />
                        </Link>
                        <img
                          src="/images/deleteHover.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteOrderHandler(order._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
