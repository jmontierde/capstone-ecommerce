import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";

import { loadUser, clearErrors } from "../../actions/userActions";

import { updatePassword } from "../../actions/userActions";

const Password = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isUpdated, loading } = useSelector((state) => state.user);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password updated successfully");
      dispatch(loadUser());
      navigate("/me");

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Log the values of oldPassword and password to ensure they are correct
    console.log("oldPassword:", oldPassword);
    console.log("password:", password);

    // Create a FormData object and append the fields to it
    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", password);
    console.log("Before dispatch");

    // Dispatch the updatePassword action with the FormData
    dispatch(updatePassword(formData));
    console.log("form data", dispatch(updatePassword(formData)));

    console.log("After dispatch");
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
          <label htmlFor="new_password_field">Old Password</label>

          <input
            type="password"
            id="new_password_field"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="uppercase bg-[#bdbfd1] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6"
            type="submit"
          >
            Update Passworda
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
