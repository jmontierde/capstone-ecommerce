import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";

import { loadUser, clearErrors } from "../../actions/userActions";
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

  console.log("ERROR", error);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      // Remove the navigate to the login route on error
      // navigate("/password");
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

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(formData));
  };

  return (
    <div className="container mx-auto flex">
      <div className="bg-[#F7F9FB] w-4/5 p-12">
        <form className="flex flex-col" onSubmit={submitHandler}>
          <label htmlFor="old_password_field">Old Password</label>
          <input
            type="password"
            id="old_password_field"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label htmlFor="new_password_field">New Password</label>

          <input
            type="password"
            id="new_password_field"
            name="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label htmlFor="confirm_password_field">Confirm Password</label>

          <input
            type="password"
            id="confirm_password_field"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="uppercase bg-[#bdbfd1] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6"
            type="submit"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
