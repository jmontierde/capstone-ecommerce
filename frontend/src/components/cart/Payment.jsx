import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearErrors } from "../../actions/orderActions";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ stripePromise }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const options = {
    style: {
      base: {
        fontSize: "16px",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:7000/api/v1/payment/process",
        paymentData,
        config
      );

      const clientSecret = response.data.client_secret;

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const order = {
            orderItems: cartItems,
            shippingInfo,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
            totalPrice: orderInfo.totalPrice,
          };
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          alert.error("There was an issue with the payment processing.");
        }
      }
    } catch (error) {
      if (error.response) {
        alert.error(error.response.data.message);
      } else {
        alert.error("An error occurred during payment processing.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-600">
      <form onSubmit={submitHandler} className="bg-[#fff] w-1/3 p-6">
        <h1 className="mb-4 font-bold text-2xl">Card Info</h1>
        <div className="w-full space-y-3">
          <label htmlFor="card_num_field">Card Number</label>
          <CardNumberElement
            id="card_num_field"
            options={options}
            className="w-full border border-[#000] p-3"
          />
        </div>

        <div className="w-full space-y-3 my-3">
          <label htmlFor="card_exp_field" className="my-3">
            Card Expiry
          </label>
          <CardExpiryElement
            id="card_exp_field"
            options={options}
            className="w-full border border-[#000] p-3"
          />
        </div>

        <div className="w-full space-y-3 my-3">
          <label htmlFor="card_cvc_field">Card CVC</label>
          <CardCvcElement
            id="card_cvc_field"
            options={options}
            className="w-full border border-[#000] p-3"
          />
        </div>

        <button
          id="pay_btn"
          type="submit"
          className="w-full bg-[#1b6d3d] py-3 my-3 text-white text-xl"
        >
          Pay {` - ${orderInfo && orderInfo.totalPrice}`}
        </button>
      </form>
    </div>
  );
};

const Payment = () => {
  const stripePromise = loadStripe(
    "pk_test_51NPZdvKg5lijREJwv1qq3kTLQiNbGrvk4jRSSJR7mskEwn109XJubNhv2i39E2i0JjjYeu3cyQEN1oBpjuN8aXzL00V4FIA37X"
  );

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm stripePromise={stripePromise} />
    </Elements>
  );
};

export default Payment;
