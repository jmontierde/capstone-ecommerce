import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  updatePassword,
  loadUser,
  clearErrors,
  clearErrorsReducer,
} from "../../actions/userActions";
import {
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_RESET,
} from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import { allUsers } from "../../actions/userActions";
import { Input, Button, Typography } from "@material-tailwind/react";

const Profile = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { error, isUpdated, loading } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.allUsers);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  const [email, setEmail] = useState();

  console.log("AAA", users);

  useEffect(() => {
    dispatch(allUsers());
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhoneNumber(user.phoneNumber);

      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    console.log("Aerror", error);

    if (error) {
      alert.error(error);
      dispatch(clearErrorsReducer());
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      dispatch(loadUser());

      // Update the states with the new values from the updated user object
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhoneNumber(user.phoneNumber);

      setEmail(user.email);
      setAvatarPreview(user.avatar.url);

      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert.error("Please fill in all the fields.");
      return;
    }

    const filteredUsers = users.filter((u) => u._id !== user._id);
    const existingEmail = filteredUsers.some((u) => u.email === email);
    const existingPhoneNumber = filteredUsers.some(
      (u) => u.phoneNumber === phoneNumber
    );

    if (existingEmail || existingPhoneNumber) {
      alert.error("Email and phone number must be unique.");
      return;
    }

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("phoneNumber", phoneNumber);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const onChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  console.log("user", user);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto bg-slate-200 mb-6">
          {/* User Profile */}
          <div className="flex flex-col w-full ">
            {/* Personal Information */}
            <div className=" w-full">
              <div className="mb-6 px-6 md:px-0">
                <h2 className="font-bold md:text-2xl text-lg">
                  General Details
                </h2>
                <p className="text-[#3f3e3e] md:text-normal text-sm">
                  Update your photo and personal details here.
                </p>
              </div>
              <form
                className="mt-8 mb-2 lg:w-full sm:w-full sm:px-6 md:px-0"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <figure className="flex items-center ">
                  <img
                    src={avatarPreview}
                    alt={user && user.name}
                    className="w-32 h-32 rounded-full"
                  />
                  <figcaption className="ml-6">
                    <h2 className="font-semibold  text-base md:text-xl">
                      {user.firstName} {user.lastName}
                    </h2>

                    <p className="text-[#000000] font-light mb-4 text-sm md:text-base">
                      {user.email}
                    </p>
                    <div className="custom-file">
                      <label
                        htmlFor="customFile"
                        className="border border-[#494848] px-6 py-1.5 rounded cursor-pointer hover:bg-[#3B49DF] hover:text-[#fff] hover:border-transparent"
                      >
                        UPDATE PROFILE
                        <input
                          type="file"
                          name="avatar"
                          className="custom-file-input"
                          id="customFile"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={onChange}
                        />
                      </label>
                    </div>
                  </figcaption>
                </figure>
                <div className="mb-4 flex flex-col items-center justify-center gap-6  mt-12">
                  <Input
                    size="lg"
                    label="Enter your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <Input
                    size="lg"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Input
                    size="lg"
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />

                  <Input
                    size="lg"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button
                  className="mt-6 md:w-auto bg-[#4F46E5]"
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
      )}
    </>
  );
};

export default Profile;
