import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

//Auth
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Password from "./components/user/Password";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";

//Cart
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Payment from "./components/cart/Payment";

import axios from "axios";

// Payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  // const dispatch = useDispatch()
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:7000/api/v1/stripeapi",
          config
        );

        console.log("Stripe data", data);
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    getStripeApiKey();
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/product" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route exact path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={<ProtectedRoute component={Shipping} />}
          />
          <Route
            path="/order/confirm"
            element={<ProtectedRoute component={ConfirmOrder} exact />}
          />
          {stripeApiKey && (
            <Route
              path="/payment"
              element={
                <ProtectedRoute
                  component={() => (
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Payment />
                    </Elements>
                  )}
                />
              }
            />
          )}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            exact
            path="/me"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route
            path="/password"
            element={<ProtectedRoute component={Password} />}
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
