import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../actions/userActions";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { isAuthenticated, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const alert = useAlert();

  console.log("error", user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/product");
    }

    console.log("ERROR", error);
  }, [dispatch, alert, user, isAuthenticated, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!user) {
      console.log("A");
      toast.error("Invalid Email or Password");
    }
    // if (error) {
    //   dispatch(clearErrors());
    //   toast.error(error);
    // }

    dispatch(login(email, password));
  };

  return (
    <div className="container mx-auto flex item-center justify-center w-screen">
      <ToastContainer />
      <Card
        color="transparent"
        shadow={false}
        className="flex item-center justify-center  "
        style={{ height: "calc(100vh - 9.5rem)" }}
      >
        <Typography variant="h4" color="blue-gray">
          Login
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={submitHandler}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input
              label="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              outline={true} // Add this line to enable the input border
            />

            <Input
              type="password"
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              outline={true} // Add this line to enable the input border
            />
            <Link to="/password/forgot">
              <span className="text-xs text-[#305FB9] font-semibold">
                Forgot Password
              </span>
            </Link>
          </div>

          <Button className="mt-6 bg-[#212121]" fullWidth type="submit">
            Login
          </Button>

          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link to="/register" className="font-medium text-gray-900">
              Sign up
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default Login;
