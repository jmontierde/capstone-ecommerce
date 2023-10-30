import React from "react";
import { Link } from "react-router-dom";
const OrderSuccess = () => {
  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen mt-20">
        <div className="text-center ">
          <img
            src="./images/order-success.png"
            className="w-1/3 mx-auto"
            alt="Order Success"
          />
          <h2 className="mb-8 mt-6">
            Your Order has been placed successfully.
          </h2>

          <Link
            to="/orders/me"
            className="bg-[#20BF55] rounded px-8 py-4 text-white font-semibold"
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
