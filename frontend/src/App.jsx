import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Profile from "./components/user/Profile";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useEffect } from "react";
import ProtectedRoute from "./components/route/ProtectedRoute";
import Password from "./components/user/Password";
import Payment from "./components/product/Payment";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
function App() {
  // const dispatch = useDispatch()

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/product" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            exact
            path="/me"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route path="/password" element={<Password />} />
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
