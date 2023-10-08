import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  //State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { error, success } = useSelector((state) => state.forgotPassword);
  // Import
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { token } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password updated successfully");
      navigate("/login");
    }
  }, [dispatch, alert, error, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("T");
    const passwords = {
      password: password,
      confirmPassword: confirmPassword,
    };

    dispatch(resetPassword(token, passwords));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] flex flex-col items-center w-2/4 h-screen my-12">
        <h1 className="font-bold mt-12 text-2xl mb-3">Reset Password</h1>
        <p className="text-center mb-3">
          Enter your new password <br />
        </p>

        <form
          className="w-full flex items-center justify-center flex-col"
          onSubmit={submitHandler}
        >
          <label htmlFor="password" className="uppercase font-semibold text-lg">
            Password
          </label>
          <br />
          <input
            type="password"
            id="password"
            className="w-1/2 my-3 py-3 rounded border border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label
            htmlFor="confirmPassword"
            className="uppercase font-semibold text-lg"
          >
            Confirm Password
          </label>
          <br />
          <input
            type="password"
            id="confirmPassword"
            className="w-1/2 my-3 py-3 rounded border border-blac k"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="uppercase bg-[#000] text-white w-1/2 py-4 mt-3 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
