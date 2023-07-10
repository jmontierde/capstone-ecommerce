import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { forgotPassword, clearErrors } from "../../actions/userActions";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, loading, message } = useSelector(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);
    }
  }, [dispatch, alert, error, message]);

  const resetHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("email", email);

    dispatch(forgotPassword(formData));
  };

  return (
    <div className="flex items-center justify-center  ">
      <div className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] flex flex-col items-center  w-2/4 h-screen my-12">
        <h1 className="font-bold mt-12 text-2xl mb-3">Forgot Password</h1>
        <p className="text-center">
          Enter your registered email ID <br />
          to reset the password.
        </p>

        <form
          className="w-full flex items-center justify-center flex-col"
          onSubmit={resetHandler}
        >
          <label
            htmlFor="resetEmail"
            className="uppercase font-semibold text-lg"
          >
            Email Id
          </label>
          <br />
          <input
            type="email"
            id="resetEmail"
            className="w-1/2 my-3 py-3 rounded border border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <button
            type="submit"
            className="uppercase bg-[#000] text-white w-1/2 py-3 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
