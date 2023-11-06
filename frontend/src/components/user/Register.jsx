import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  clearErrors,
  clearErrorsReducer,
} from "../../actions/userActions";
import axios from "axios";

// import MetaData from './layout/MetaData'
import { useAlert } from "react-alert";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const { firstName, lastName, email, password, phoneNumber } = user;

  const [avatar, setAvatar] = useState(null);
  // const [avatarPreview, setAvatarPreview] = useState(
  //   "https://res.cloudinary.com/dnp4vos6e/image/upload/v1693368990/default_avatar_gfoa21.png"
  // );

  const [validId, setValidId] = useState(null);
  const [withBirthdayId, setWithBirthdayId] = useState(null);

  const [checkTerms, setCheckTerms] = useState(false);

  // const [hideProfile, setHideProfile] = useState(true);

  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You've successfully created an account"); // Display success toast
      console.log("HELLO WORLD");

      navigate("/login");
    }
    console.log("isAuthenticated", isAuthenticated);

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, toast, isAuthenticated, error]);

  const isRequiredFieldEmpty =
    !firstName || !lastName || !email || !password || !phoneNumber;

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("ERROR", error);

    if (isRequiredFieldEmpty) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!avatar || avatar.length === 0) {
      toast.error("Please select one image for the avatar.");
      return;
    }

    if (!validId || validId.length === 0) {
      toast.error("Please select one image for the valid id.");
      return;
    }

    if (!withBirthdayId || withBirthdayId.length === 0) {
      toast.error("Please select one image for the valid id with birthday id.");
      return;
    }

    if (!checkTerms) {
      toast.error("Please check the terms and conditions");
      return;
    }

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("phoneNumber", phoneNumber);
    formData.set("avatar", avatar);
    formData.set("validId", validId);
    formData.set("withBirthdayId", withBirthdayId);

    dispatch(register(formData));

    // if (success) {
    //   toast.success("You've succefully create an account");
    //   toast.error("Your account is pending verification by the admin.");
    //   // Registration was successful, navigate to login page
    //   navigate("/login");
    // }
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          // setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "validId") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setValidId(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "withBirthdayId") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setWithBirthdayId(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // Need to add hide default image
  // const handleRemoveImage = () => {
  //     setAvatar(null);
  //     setAvatarPreview(null);
  //     setSelectedAvatar(false);
  //     setHideProfile(false);
  //   };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto mt-20">
        <div
          className="flex justify-center items-center flex-col py-6  "
          // style={{ height: "calc(100vh - 9.5rem)" }}
        >
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Enter your details to register.
            </Typography>
            <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  label="Firs tName"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={onChange}
                  className="border border-[#000]"
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={onChange}
                  className="border border-[#000]"
                />

                <Input
                  label="Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="border border-[#000]"
                />
                <Input
                  type="password"
                  label="Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="border border-[#000]"
                />

                <PhoneInput
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(value) => setUser({ ...user, phoneNumber: value })}
                  defaultCountry="PH"
                  onKeyPress={(e) => {
                    if (phoneNumber.length >= 13) {
                      e.preventDefault(); // Prevent typing more characters
                    }
                  }}
                  className="border border-[#000] w-96 h-12 rounded"
                />
                <>
                  <div className="flex flex-col ">
                    <div>
                      <div className="relative space-y-3">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 cursor-pointer"
                          htmlFor="avatar"
                        >
                          Upload Avatar
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            for="avatar"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <input
                              id="avatar"
                              name="avatar"
                              onChange={onChange}
                              type="file"
                              className="hidden"
                            />
                          </label>
                        </div>
                        {avatar && (
                          <img
                            src={avatar}
                            className="rounded-circle w-32 h-32"
                            alt="Valid ID"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>

                <>
                  <div className="flex flex-col ">
                    <div>
                      <div className="relative space-y-3">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900  cursor-pointer"
                          htmlFor="validId"
                        >
                          Submit (1) valid id (include birthdate)
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            for="validId"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <input
                              id="validId"
                              name="validId"
                              onChange={onChange}
                              type="file"
                              className="hidden"
                            />
                          </label>
                        </div>

                        {validId && (
                          <img
                            src={validId}
                            className="rounded-circle w-32 h-32"
                            alt="Valid ID"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>

                <>
                  <div className="flex flex-col ">
                    <div>
                      <div className="relative space-y-3">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900  cursor-pointer"
                          htmlFor="withBirthdayId"
                        >
                          Submit (1) valid id (include birthdate)
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            for="withBirthdayId"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <input
                              id="withBirthdayId"
                              name="withBirthdayId"
                              onChange={onChange}
                              type="file"
                              className="hidden"
                            />
                          </label>
                        </div>

                        {validId && (
                          <img
                            src={withBirthdayId}
                            className="rounded-circle w-32 h-32"
                            alt="withBirthdayId"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              </div>
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center font-normal"
                  >
                    I agree the
                    <Link
                      to="/terms"
                      className="font-medium transition-colors hover:text-gray-900 text-black"
                    >
                      &nbsp;Terms and Conditions
                    </Link>
                  </Typography>
                }
                className=" text-black"
                containerProps={{ className: "-ml-2.5" }}
                checked={checkTerms}
                onChange={(e) => setCheckTerms(e.target.checked)}
              />

              <Button className="mt-6 bg-[#000]" type="submit" fullWidth>
                Register
              </Button>
              <Typography color="gray" className="mt-4 text-center font-normal">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-gray-900">
                  Sign In
                </Link>
              </Typography>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
