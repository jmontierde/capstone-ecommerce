import { useDispatch, useSelector } from "react-redux";
import React, { Fragment, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateUser,
  getUserDetails,
  clearErrors,
} from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader";
import { allUsers } from "../../actions/userActions";
import PhoneInput from "react-phone-number-input";

import {
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
const UpdateUser = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, isUpdated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.userDetails);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState("");
  const userId = useParams().id;

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    }

    //  else {
    //   setFirstName(user.firstName);
    //   setLastName(user.lastName);
    //   setPhoneNumber(user.phoneNumber);
    //   setRole(user.role);
    //   setEmail(user.email);
    // }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User updated successfully");
      navigate(`/admin/users`);

      // Update the states with the new values from the updated user object
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhoneNumber(user.phoneNumber);
      setEmail(user.email);
      setRole(user.role);

      dispatch({
        type: UPDATE_USER_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      alert.error("Please fill in all the fields.");
      return;
    }

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("phoneNumber", phoneNumber);
    formData.set("email", email);
    formData.set("role", role);

    dispatch(updateUser(user._id, formData));
  };

  const roles = ["user", "staff", "admin"];

  console.log("roles", role);

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full ">
        <Sidebar />
        {/* User Profile */}
        <div className="flex  w-full mt-20">
          {/* Personal Information */}
          <div className=" w-full ">
            <form
              className=" mb-2  sm:w-full sm:px-6 md:px-0 mx-6"
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <h2 className="font-semibold md:text-2xl text-left text-lg my-6">
                Update User
              </h2>
              <div className="mb-4 flex flex-col items-center justify-center gap-6   w-5/6">
                <Input
                  size="lg"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                  size="lg"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {/* <Input
                  size="lg"
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const numericPhoneNumber = e.target.value.replace(
                      /\D/g,
                      ""
                    );
                    setPhoneNumber(numericPhoneNumber);
                  }}
                  pattern="[0-9]*"
                  title="Please enter only numbers."
                  error={
                    phoneNumber && phoneNumber.length === 0
                      ? "Phone number is required."
                      : ""
                  }
                /> */}

                <PhoneInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="w-full border my-custom-input border-[#000] rounded"
                  onKeyPress={(e) => {
                    if (phoneNumber.length >= 13) {
                      e.preventDefault(); // Prevent typing more characters
                    }
                  }}
                />

                <Input
                  size="lg"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  label="Select Category"
                  className="py-6"
                  onChange={(value) => setRole(value)}
                >
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </div>

              <Button
                className="mt-6 md:w-auto w-5/6 lg:w-auto  bg-[#4F46E5]"
                size="lg"
                fullWidth
                type="submit"
              >
                Update
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
