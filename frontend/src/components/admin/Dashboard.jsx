import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productActions";
import { allOrders } from "../../actions/orderActions";
import { allUsers } from "../../actions/userActions";
const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);
  const { orders, totalAmount, loading } = useSelector(
    (state) => state.allOrders
  );
  const { user } = useSelector((state) => state.auth);

  console.log("ORDERS", orders);

  //   let outOfStock = 0;
  //   products.forEach((product) => {
  //     if (product.stock === 0) {
  //       outOfStock += 1;
  //     }
  //   });

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(allOrders());
    dispatch(allUsers());
  }, [dispatch]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="w-3/4 container p-6 space-y-6">
            <h1 className="font-semibold text-4xl">Welcome back!</h1>

            <div className="flex gap-6">
              <section className="flex flex-col w-80 ">
                <div className="text-center  h-full flex flex-col ">
                  <div className="bg-[#1D1D1D] flex justify-center items-center rounded-t-lg  h-36 w-full space-x-1 ">
                    <img
                      src={user.avatar.url}
                      alt="avatar"
                      className="rounded-full w-24 h-24"
                    />

                    <div className=" break-all">
                      <h2 className="text-[#fff] text-lg">{user.name}</h2>
                      <p className="text-[#BBC363] text-sm">{user.email}</p>
                    </div>
                  </div>

                  <div className="bg-[#E9F167] h-36 text-left rounded-b-lg  p-6">
                    <h5 className="text-lg">Total Amount</h5>
                    <p className="font-bold text-4xl">
                      ₱{totalAmount && totalAmount.toFixed(2)}
                      {/* ₱57,142.23 */}
                    </p>
                  </div>
                </div>
              </section>
              {/* Other Info */}
              <section className="w-4/6">
                <div className="flex justify-around items-center gap-6 text-white">
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-lg">Products</h4>
                    <p>{products && products.length}</p>
                    <Link to="/admin/products">View Details</Link>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-lg">Orders</h4>
                    <p>{orders && orders.length}</p>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-lg">Users</h4>
                    <p>{users && users.length}</p>
                  </div>
                  <div className="bg-[#373737] w-full rounded-lg h-36 flex flex-col justify-center items-center">
                    <h4 className="text-lg">Out of Stock</h4>
                    <p>4</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
