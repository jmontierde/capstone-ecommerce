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
import { useNavigate, Link } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { clearCart } from "../../actions/cartActions";
import {
  Radio,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  CreditCardIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

export const PaymentForm = ({ stripePromise }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  const [paymentMethod, setPaymentMethod] = useState("card");

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

  console.log("ORDER", order);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  console.log("cartItemscartItemscartItems", cartItems);

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
  const url = "https://vapingsidewalk-server.onrender.com";

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

      if (paymentMethod === "card") {
        const response = await axios.post(
          `${url}/api/v1/payment/process`,
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
              // firstName: user.firstName,
              // lastName: user.lastName,
              email: user.email,
            },
          },
        });

        console.log("A");

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
            order.paymentMethod = "CARD";
            console.log("PAYMENT INFO", order);
            dispatch(createOrder(order));

            dispatch(clearCart());

            navigate("/success");
          } else {
            alert.error("There was an issue with the payment processing.");
          }
        }
      } else if (paymentMethod === "cash") {
        // Create an order with COD payment
        const order = {
          orderItems: cartItems,
          shippingInfo,
          paymentInfo: {
            status: "Cash On Delivery", // You can customize this status
          },
          totalPrice: orderInfo.totalPrice,
        };
        order.paymentMethod = "COD";

        console.log("COD ORDER", order);
        const { data } = await axios.post(
          `${url}/api/v1/order/new`,
          order,
          config
        );

        console.log("data", data);

        dispatch(clearCart());

        alert.success("Order placed successfully!");
        navigate("/success");
      }
    } catch (error) {
      if (error.response) {
        alert.error(error.response.data.message);
      } else {
        alert.error("An error occurred during payment processing.");
      }
    }
  };

  //

  return (
    <div className=" flex flex-col  min-h-screen pt-28  px-12 pb-8">
      <CheckoutSteps />
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-semibold my-3 text-xl"> Payment Method</h1>

        <Card className="w-full max-w-[24rem] ">
          <List className="flex-row">
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-react"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Radio
                    name="horizontal-list"
                    id="horizontal-list-react"
                    ripple={false}
                    className="hover:before:opacity-0"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    containerProps={{
                      className: "p-0",
                    }}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Credit/Debit Card
                </Typography>
              </label>
            </ListItem>
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-vue"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Radio
                    name="horizontal-list"
                    id="horizontal-list-vue"
                    ripple={false}
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Cash on Delivery
                </Typography>
              </label>
            </ListItem>
          </List>
        </Card>
        {/* ONLINE PAYMENT */}
        {paymentMethod === "card" ? (
          <form
            onSubmit={submitHandler}
            className="w-full lg:w-1/3 py-12 lg:px-8 my-6 bg-[#fff] rounded"
          >
            <h1 className="mb-4 font-bold text-xl">Card Details</h1>
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

            {/* <button
              id="pay_btn"
              type="submit"
              className="w-full bg-[#1b6d3d] py-3 my-3 text-white text-xl"
            >
              Pay {` - ₱${orderInfo && orderInfo.totalPrice}`}
            </button> */}
            <Button size="lg" className=" w-full my-3" type="submit">
              Pay Now
            </Button>
            <Typography
              variant="lg"
              type="submit"
              color="gray"
              className="mt-2 flex items-center justify-center gap-2 font-normal opacity-60"
            >
              <LockClosedIcon className="-mt-0.5 h-4 w-4 " /> Payments are
              secure and encrypted
            </Typography>
          </form>
        ) : (
          <span className="my-6">
            <Button
              ripple={true}
              // size="lg"
              className="px-12 py-3"
              onClick={submitHandler}
            >
              Order
            </Button>
          </span>
        )}
      </div>
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
