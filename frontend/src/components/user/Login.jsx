import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../actions/userActions";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { isAuthenticated, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    console.log("Error from Redux:", error);
    if (isAuthenticated) {
      navigate("/product");
    }
    if (error) {
      dispatch(clearErrors());
      toast.error(error);
    }
  }, [dispatch, alert, user, isAuthenticated, error]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <div className="container mx-auto ">
      <ToastContainer />
      <div
        className="flex justify-center items-center flex-col py-6 border-dotted border-[#d05e5e] border-4 "
        style={{ height: "calc(100vh - 9.5rem)" }}
      >
        <h1 className="font-bold text-xl">Login</h1>
        {/* {error && <div className="text-red-500 text-center mt-2">{error}</div>} */}
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-2 px-16 py-6">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#000] w-96 rounded py-1"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#000] w-96 rounded py-1"
            />
            <Link
              to="/password/forgot"
              className="ml-auto text-[#757777] text-sm"
            >
              Forgot Password
            </Link>
            <button
              type="submit"
              className="bg-[#6921EF] border rounded py-2 my-3 text-[#fff]"
            >
              Login
            </button>
            <p className="text-[#7B7E82] text-sm text-center">
              You don't have an account yet?{" "}
              <Link to="/register" className="text-[#997BD4] font-bold">
                Sign up
              </Link>
            </p>
            <p className="text-[#7B7E82] text-sm text-center">
              <Link to="/terms" className="text-[#997BD4] font-bold">
                Terms and Conditions
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
