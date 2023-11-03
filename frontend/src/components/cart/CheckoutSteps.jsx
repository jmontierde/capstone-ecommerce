import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className=" flex flex-col mx-6 sm:px-6  ">
      <Breadcrumbs>
        <Link
          to="/cart"
          className={`cursor-pointer ${
            selectedItem === "Shopping Cart" ? "font-bold" : ""
          }`}
          onClick={() => handleItemClick("Shopping Cart")}
        >
          Shopping Cart
        </Link>

        {shipping ? (
          <Link
            to="/shipping"
            className={`cursor-pointer ${
              selectedItem === "Checkout Details" ? "font-bold" : ""
            }`}
            onClick={() => handleItemClick("Checkout Details")}
          >
            Shipping Info
          </Link>
        ) : (
          <Link to="#!" disable="true">
            Shipping
          </Link>
        )}

        {confirmOrder ? (
          <Link
            to="/order/confirm"
            className={`cursor-pointer ${
              selectedItem === "Checkout Details" ? "font-bold" : ""
            }`}
            onClick={() => handleItemClick("Checkout Details")}
          >
            Confirm Order
          </Link>
        ) : (
          <Link to="#!" disable="true">
            Confirm Order
          </Link>
        )}

        {payment ? (
          <Link
            to="/payment"
            className={`cursor-pointer ${
              selectedItem === "Payment" ? "font-bold" : ""
            }`}
            onClick={() => handleItemClick("Payment")}
          >
            Payment
          </Link>
        ) : (
          <Link to="#!">Payment</Link>
        )}
      </Breadcrumbs>
    </div>
  );
};

export default CheckoutSteps;
