import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import SidebarAccount from "./SidebarAccount";

import Loader from "../layout/Loader";

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

  const [name, setName] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    if (user) {
      setName(user.name);
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
      setName(user.name);
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
    formData.set("name", name);
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto bg-slate-200 mb-6">
          {/* User Profile */}
          <div className="flex w-full  border border-t-[#9a9a9a]">
            <SidebarAccount />
            {/* Personal Information */}
            <div className="bg-[#F7F9FB] w-4/5 p-12">
              <div className="mb-6">
                <h2 className="font-bold text-2xl">General Details</h2>
                <p className="text-[#3f3e3e] text-sm">
                  Update your photo and personal details here.
                </p>
              </div>
              <form
                onSubmit={submitHandler}
                encType="multipart/form-data"
                className="bg-[#FFF] border rounded-md p-6"
              >
                <div>
                  <figure className="flex items-center ">
                    <img
                      src={avatarPreview}
                      alt={user && user.name}
                      className="w-32 h-32 rounded-full"
                    />
                    <figcaption className="ml-6">
                      <h2 className="font-semibold text-xl">{user.name}</h2>
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
                    <h5>Full name</h5>
                    <input
                      type="name"
                      id="name_field"
                      name="name"
                      className="border border-[#000] p-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
