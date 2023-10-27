import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

//Auth
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
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
import { loadUser } from "./actions/userActions";
import { useSelector } from "react-redux";
// Payment
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
import OrderSuccess from "./components/cart/OrderSuccess";
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import Report from "./components/admin/Report";
import Three from "./components/Three";
import Customizer from "./components/pages/Customizer";
import NewCategory from "./components/admin/NewCategory";
import VerifyUser from "./components/admin/VerifyUser";
import TermsAndConditionsComponent from "./components/user/TermsAndConditions";
import UpdateTerms from "./components/admin/UpdateTerms";
import { useNavigate } from "react-router-dom";
import Refund from "./components/order/Refund";
import AllRefunds from "./components/admin/AllRefunds";
import Messenger from "./Messenger";
import Material from "./components/pages/Material";
import TestPayment from "./components/cart/TestPayment";
import Wishlist from "./components/product/Wishlist";
import AgeVerification from "./components/user/AgeVerification";
import HomePage from "./components/HomePage";

function App() {
  // const dispatch = useDispatch()
  const [stripeApiKey, setStripeApiKey] = useState("");
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = () => {
    setIsVerified(true);
  };

  const navigate = useNavigate();

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
        {/* 
        {!isVerified && !isAuthenticated ? (
          <AgeVerification onVerification={handleVerification} />
        ) : ( */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/terms" element={<TermsAndConditionsComponent />} />
          {/* {termsAccepted ? (
        <> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/three" element={<Three />} />
          <Route exact path="/material" element={<TestPayment />} />

          <Route
            path="/shipping"
            element={<ProtectedRoute component={Shipping} />}
          />
          <Route
            path="/order/confirm"
            element={<ProtectedRoute component={ConfirmOrder} exact />}
          />
          <Route
            path="/success"
            element={<ProtectedRoute component={OrderSuccess} exact />}
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

          <Route
            path="/orders/me"
            element={<ProtectedRoute component={ListOrders} exact />}
          />
          <Route
            path="/order/:id"
            element={<ProtectedRoute component={OrderDetails} exact />}
          />
          <Route
            path="/refund"
            element={<ProtectedRoute component={Refund} exact />}
          />
          <Route
            path="/wishlist"
            element={<ProtectedRoute component={Wishlist} exact />}
          />

          {/* Admin */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} isAdmin={true} />}
          />

          <Route
            path="/admin/refunds"
            element={<ProtectedRoute component={AllRefunds} isAdmin={true} />}
          />

          <Route
            path="/admin/verify/:userId"
            element={<ProtectedRoute component={VerifyUser} exact />}
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute
                component={ProductsList}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/product"
            element={
              <ProtectedRoute
                component={NewProduct}
                isAdmin={true}
                isStaff={true}
              />
            }
          />

          <Route
            path="/admin/product/:id"
            element={
              <ProtectedRoute
                component={UpdateProduct}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute
                component={OrderList}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/order/:id"
            element={
              <ProtectedRoute
                component={ProcessOrder}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                component={UsersList}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute
                component={UpdateUser}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute
                component={ProductReviews}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
          <Route
            path="/admin/report"
            element={
              <ProtectedRoute
                component={Report}
                isAdmin={true}
                isStaff={true}
              />
            }
          />

          <Route
            path="/admin/maintenance/category"
            element={
              <ProtectedRoute
                component={NewCategory}
                isAdmin={true}
                isStaff={true}
              />
            }
          />

          <Route
            path="admin/maintenance/update/term"
            element={
              <ProtectedRoute
                component={UpdateTerms}
                isAdmin={true}
                isStaff={true}
              />
            }
          />
        </Routes>
        {/* )} */}

        <Messenger />
        {/* <Customizer /> */}
        {/* {!loading && (!isAuthenticated || user.role !== "admin") && <Footer />} */}
      </div>
    </>
  );
}

export default App;
