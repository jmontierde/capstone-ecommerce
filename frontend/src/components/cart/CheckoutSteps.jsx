import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";
const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex justify-center gap-6 items-center uppercase text-xl mt-12">
      <Link
        to="/cart"
        className={`cursor-pointer ${
          selectedItem === "Shopping Cart" ? "font-bold" : ""
        }`}
        onClick={() => handleItemClick("Shopping Cart")}
      >
        Shopping Cart
      </Link>
      <BsChevronRight />

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
        <Link to="#!" disable>
          Shipping
        </Link>
      )}
      <BsChevronRight />
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
        <Link to="#!" disable>
          Confirm Order
        </Link>
      )}
      <BsChevronRight />
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
    </div>
  );
};

export default CheckoutSteps;
