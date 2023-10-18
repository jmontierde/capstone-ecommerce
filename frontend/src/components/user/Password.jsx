import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { Input } from "@material-tailwind/react";
import {
  loadUser,
  clearErrors,
  clearErrorsReducer,
} from "../../actions/userActions";
import { useAlert } from "react-alert";
import { updatePassword } from "../../actions/userActions";

const Password = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, isUpdated, loading } = useSelector(
    (state) => state.updatePass
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);

      console.log("ERROR", error);
      dispatch(clearErrorsReducer());
      // Remove the navigate to the login route on error
      navigate("/password");
    }

    if (isUpdated) {
      alert.success("Password updated successfully");
      dispatch(loadUser());
      // Redirect the user to a different route on success, if needed
      navigate("/me");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert.error("Please fill in all the fields.");
      return;
    }

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(formData));
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 90px)" }}
    >
      <form
        className="mt-8 mb-2 space-y-6 w-80 max-w-screen-lg sm:w-96"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <Input
          label="Current Password"
          id="current-password"
          size="lg"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Input
          label="New Password"
          id="new-password"
          size="lg"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          id="confirm-password"
          size="lg"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="uppercase bg-[#3B49DF] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6 w-full"
          type="submit"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default Password;
