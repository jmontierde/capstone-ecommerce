import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productActions";
import { allOrders } from "../../actions/orderActions";
import { allUsers } from "../../actions/userActions";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
ChartJS.register(...registerables);
import { Bar } from "react-chartjs-2";
const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);
  const { orders, totalAmount, loading } = useSelector(
    (state) => state.allOrders
  );
  const { user } = useSelector((state) => state.auth);

  let outOfStock = 0;
  products.forEach((product) => {
    if (product.stock === 0) {
      outOfStock += 1;
    }
  });

  // Filter "Paid" orders and calculate the total amount
  const paidOrders = orders
    ? orders.filter((order) => order?.paymentStatus === "Paid")
    : [];

  const totalAmountOrder = paidOrders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  console.log("totalAmountOrder", totalAmountOrder);

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(allOrders());
    dispatch(allUsers());
  }, [dispatch]);

  const chartData = {
    labels: ["Products", "Orders", "Users", "Out of Stock"],
    datasets: [
      {
        label: "Data Count",
        backgroundColor: ["#373737", "#373737", "#373737", "#373737"],
        data: [
          products ? products.length : 0,
          orders ? orders.length : 0,
          users ? users.length : 0,
          outOfStock,
        ],
      },
    ],
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col lg:flex-row ">
          <Sidebar />
          <div className="w-full container p-6 space-y-6 mt-20">
            <h1 className="font-semibold text-4xl">Welcome back!</h1>

            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <section className="flex flex-col w-full lg:w-4/12 ">
                <div className="text-center  h-full flex flex-col ">
                  <div className="bg-[#1D1D1D] flex justify-start items-center rounded-t-lg px-6  h-36 w-full space-x-1 ">
                    <img
                      src={user.avatar.url}
                      alt="avatar"
                      className="rounded-full w-24 h-24 bg-[#fefbfb]"
                    />

                    <div className=" text-left px-1 break-all">
                      <h2 className="text-[#fff] text-lg">{`${user.firstName} ${user.lastName}`}</h2>
                      <p className="text-[#BBC363] text-sm">{user.email}</p>
                    </div>
                  </div>

                  <div className="bg-[#E9F167] h-36 text-left rounded-b-lg  p-6">
                    <h5 className="text-lg">Total Amount</h5>
                    <p className="font-bold text-4xl">
                      ₱
                      {totalAmountOrder &&
                        parseFloat(totalAmountOrder).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      {/* ₱57,142.23 */}
                    </p>
                  </div>
                </div>
              </section>
              {/* Other Info */}
              <section className="w-full  lg:w-8/12  ">
                <div className="flex justify-around items-center gap-1 lg:gap-6 text-white">
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-sm lg:text-lg">Products</h4>
                    <p>{products && products.length}</p>
                    <Link
                      to="/admin/products"
                      className="text-xs lg:text-base hover:opacity-70"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-sm lg:text-lg">Orders</h4>
                    <p>{orders && orders.length}</p>
                    <Link
                      to="/admin/orders"
                      className="text-xs lg:text-base hover:opacity-70"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-sm lg:text-lg">Users</h4>
                    <p>{users && users.length}</p>
                    <Link
                      to="/admin/users"
                      className="text-xs lg:text-base hover:opacity-70"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-sm  lg:text-lg text-center">
                      Out of Stock
                    </h4>
                    <p>{outOfStock}</p>
                  </div>
                </div>
              </section>
            </div>
            <div className="mt-6">
              <h4 className="text-lg">Orders Over Time</h4>
              <Bar data={chartData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
