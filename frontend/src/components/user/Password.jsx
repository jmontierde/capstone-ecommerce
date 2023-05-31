import React, { useState } from "react";
import SidebarAccount from "./SidebarAccount";

// import { useNavigate } from "react-router-dom";
// import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant";

// const { isAuthenticated, user } = useSelector((state) => state.auth);
// const { error, isUpdated, loading } = useSelector((state) => state.user);

// import {
//   updatePassword,
//   loadUser,
//   clearErrors,
// } from "../../actions/userActions";
// const [password, setPassword] = useState("");
// const [newPassword, setNewPassword] = useState("");
// const [confirmPassword, setConfirmPassword] = useState("");

// const navigate = useNavigate();

// useEffect(() => {

//   if (error) {
//     alert.error(error);
//     dispatch(clearErrors());
//   }

//   if (isUpdated) {
//     alert.success("Password updated successfully");
//     dispatch(loadUser());
//     navigate('/me')
//     // Update the states with the new values from the updated user object
//     setName(user.name);
//     setEmail(user.email);
//     setAvatarPreview(user.avatar.url);

//     dispatch({
//       type: UPDATE_PASSWORD_RESET,
//     });
//   }
// }, [dispatch, alert, error, isUpdated, user]);

// const submitHandler = (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.set("password", password);
//   formData.set("newPassword", newPassword);

//   dispatch(updatePassword(formData));
// };

// const onChange = (e) => {
//   const reader = new FileReader();

//   reader.onload = () => {
//     if (reader.readyState === 2) {
//       setAvatarPreview(reader.result);
//       setAvatar(reader.result);
//     }
//   };

//   reader.readAsDataURL(e.target.files[0]);
// };

const Password = () => {
  return (
    <div className="container mx-auto flex">
      <SidebarAccount />
      <div className="bg-[#F7F9FB] w-4/5 p-12">
        <form className="flex flex-col">
          <label htmlFor="current-password">Current Password</label>
          <input type="password" id="current-password" />
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" />
          <button className="uppercase bg-[#3B49DF] rounded py-3 px-9 text-white hover:bg-[#3B71CA] text-sm my-6">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
