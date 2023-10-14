import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useAlert } from "react-toast";
import { useNavigate } from "react-router-dom";
import { forgotPassword, clearErrors } from "../../actions/userActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  // const toast = useAlert();
  const { error, loading, message } = useSelector((state) => state.forgotPass);

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [dispatch, toast, error, message]);

  const resetHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("email", email);
    console.log("formData", formData);
    dispatch(forgotPassword(formData));
  };

  return (
    // <div className="flex items-center justify-center  ">
    //   <div className="shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] flex flex-col items-center  w-2/4 h-screen my-12">
    //     <h1 className="font-bold mt-12 text-2xl mb-3">Forgot Password</h1>
    //     <p className="text-center">
    //       Enter your registered email ID <br />
    //       to reset the password.
    //     </p>

    //     <form
    //       className="w-full flex items-center justify-center flex-col"
    //       onSubmit={resetHandler}
    //     >
    //       <label
    //         htmlFor="resetEmail"
    //         className="uppercase font-semibold text-lg"
    //       >
    //         Email Id
    //       </label>
    //       <br />
    //       <input
    //         type="email"
    //         id="resetEmail"
    //         className="w-1/2 my-3 py-3 rounded border border-black"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //       <br />
    //       <button
    //         type="submit"
    //         className="uppercase bg-[#000] text-white w-1/2 py-3 rounded"
    //       >
    //         Send
    //       </button>
    //     </form>
    //   </div>
    // </div>

    <div class="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h1 class="text-4xl font-medium">Reset password</h1>
      <p class="text-slate-500">Fill up the form to reset the password</p>

      <form class="my-10" onSubmit={resetHandler}>
        <div class="flex flex-col space-y-5">
          <label for="email">
            <p class="font-medium text-slate-700 pb-2">Email address</p>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter email address"
            />
          </label>

          <button
            class="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>

            <span>Reset password</span>
          </button>
          <p class="text-center">
            Not registered yet?{" "}
            <a
              href="#"
              class="text-indigo-600 font-medium inline-flex space-x-1 items-center"
            >
              <span>Register now </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
