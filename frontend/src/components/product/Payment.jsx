import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getProductDetails } from "../../actions/productActions";
import { useParams } from "react-router-dom";
const Payment = () => {
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  console.log(product);
  return (
    <div className="container px-12 py-6 mx-auto">
      <div className="flex ">
        <div className="w-2/3  flex">
          <div className="flex">
            <div className="w-1/3 outline-dashed text-center">
              {product.images &&
                product.images.map((img, index) => (
                  <img
                    className="w-72"
                    key={index}
                    src={img.url}
                    alt={product.title}
                  />
                ))}
              <h3 className="text-center font-bold">Delivery Information</h3>
              <p>Plantsssa</p>
              <p>09273126995</p>
              <p>
                Tanza, Navotas <br />
                Philippines
              </p>
            </div>
            <div className="w-2/3 outline-dashed p-6">
              <h1 className="font-bold text-2xl">{product.name}</h1>
              <h2 className="font-semibold py-3">1 item</h2>
              <p>{product.description}</p>
              <button className="mt-24 ml-96 px-6 py-2 text-white rounded bg-[#1e4465]">
                Edit Address
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/3 p-6 ml-12 outline-dashed">
          <h2>Payment Method</h2>
          <div className="flex flex-col">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 h-5 w-5"
                name="radioGroup"
                value="cashOnDelivery"
                onChange={handlePaymentMethodChange}
              />
              <span className="ml-2 text-gray-700">Cash on Delivery</span>
            </label>

            <label className="inline-flex  items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600 h-5 w-5"
                name="radioGroup"
                value="onlinePayment"
                onChange={handlePaymentMethodChange}
              />
              <span className="ml-2 text-gray-700">Online Payment</span>
            </label>

            {paymentMethod === "onlinePayment" && (
              <div className="flex flex-col py-3">
                {/* Additional choices for online payment */}
                <label className="inline-flex  items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 h-5 w-5"
                    name="onlinePaymentOptions"
                    value="option1"
                  />
                  <img
                    src="/images/gcash.png"
                    className="w-24 rounded ml-3"
                    alt="gcash"
                  />
                </label>

                <label className="inline-flex items-center py-3">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 h-5 w-5"
                    name="onlinePaymentOptions"
                    value="option2"
                  />
                  <img
                    src="/images/paymaya.webp"
                    className="w-24 rounded ml-3 h-24"
                    alt="paymaya"
                  />
                </label>
              </div>
            )}
          </div>
          {/* Order Summary */}
          <h4 className="font-semibold pb-3">Order Summary</h4>
          <div className="w-full  flex flex-col">
            <div className="flex justify-between ">
              <h4>Total</h4>
              <h5>₱{product.price}</h5>
            </div>
            <button className="bg-[#31ac3d] px-6 py-3 text-white rounded w-1/3 mt-6 mx-auto">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
