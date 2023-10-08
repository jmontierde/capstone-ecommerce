import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  updatePassword,
  loadUser,
  clearErrors,
} from "../../actions/userActions";
import {
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_RESET,
} from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import Loader from "../layout/Loader";
import { Input } from "@material-tailwind/react";

const Profile = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { error, isUpdated, loading } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      dispatch(loadUser());

      // Update the states with the new values from the updated user object
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);

      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
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

  // Password
  const [oldPassword, setOldPassword] = useState();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log("A", user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Password updated successfully");
      dispatch(loadUser());
      navigate("/me");
      // Update the states with the new values from the updated user object
      // setPassword(user.password);
      // setNewPassword(newPassword);
      // setConfirmPassword(confirmPassword);

      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, isUpdated, user]);

  const submitHandlerPassword = (e) => {
    e.preventDefault();
    const formDataPassword = new FormData();
    formDataPassword.set("oldPassword", oldPassword);
    formDataPassword.set("password", password);

    dispatch(updateProfile(formDataPassword));
    // if (newPassword !== confirmPassword) {
    //   alert.error("The new password and confirm password do not match");
    //   return;
    // }

    // const passwordData = {
    //   oldPassword: password,
    //   newPassword: newPassword,
    //   confirmPassword: confirmPassword,
    // };

    console.log("FORM", formDataPassword);

    dispatch(updatePassword(formDataPassword));
  };

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
              <div className="mb-6">
                <h2 className="font-bold text-2xl">General Details</h2>
                <p className="text-[#3f3e3e] text-sm">
                  Update your photo and personal details here.
                </p>
              </div>
              <form
                onSubmit={submitHandler}
                encType="multipart/form-data"
                className="bg-[#FFF] border-b-3 rounded-md py-6"
              >
                <div>
                  <figure className="flex items-center ">
                    <img
                      src={avatarPreview}
                      alt={user && user.name}
                      className="w-32 h-32 rounded-full"
                    />
                    <figcaption className="ml-6">
                      <h2 className="font-semibold text-xl">
                        {user.firstName} {user.lastName}
                      </h2>

                      <p className="text-[#000000] font-light mb-4">
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
                  <div className="flex flex-col gap-3">
                    <h4 className="font-semibold mt-6">Personal</h4>
                    <hr />
                    <h5>First name</h5>
                    <input
                      type="input"
                      id="name_field"
                      name="firstName"
                      className="border border-[#000] p-3"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <h5>Last name</h5>
                    <input
                      type="input"
                      id="name_field"
                      name="lastName"
                      className="border border-[#000] p-3"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <h5>Email</h5>
                    <input
                      type="email"
                      id="email_field"
                      name="email"
                      className="border border-[#000] p-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button className="bg-[#3B49DF] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6">
                  UPDATE
                </button>
              </form>
            </div>

            <div>
              <form
                className="flex flex-col space-y-6"
                encType="multipart/form-data"
                onSubmit={submitHandlerPassword}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <Input
                  label="Confirm Password"
                  id="confirm-password"
                  size="lg"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                /> */}

                <button
                  className="uppercase bg-[#3B49DF] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6"
                  type="submit"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
