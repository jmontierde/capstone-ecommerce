import React, { Fragment, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  getUserDetails,
  clearErrors,
} from "../../actions/userActions";
import { UPDATE_USER_RESET } from "../../constants/userConstant";

import { useNavigate, useParams } from "react-router-dom";
const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.userDetails);

  const userId = useParams().id;

  useEffect(() => {
    console.log(user && user._id !== userId);
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    console.log("ISUPDATED ", isUpdated);

    if (isUpdated) {
      toast.success("User updated successfully");
      navigate("/admin/users");

      dispatch({
        type: UPDATE_USER_RESET,
      });
    }
  }, [dispatch, toast, error, navigate, isUpdated, userId, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("role", role);

    dispatch(updateUser(user._id, formData));
  };

  return (
    <>
      <ToastContainer />
      <div className="flex container mx-auto px-12">
        <Sidebar />
        <div className="w-10/12 container p-6">
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <div className="flex space-x-12 ">
              <section className="w-1/2 flex flex-col space-y-1">
                <label htmlFor="productName">Name</label>
                <input
                  type="text"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-[#000] py-2 my-1 px-3"
                />
                <div className="flex flex-col py-2 my-1 space-y-1">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="price"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-[#000] py-2 my-1 px-3"
                  />
                </div>
                <div className="flex flex-col w-full space-y-1">
                  <label htmlFor="category">Role</label>
                  <br />
                  <select
                    className="border border-[#000] py-2 my-1 px-3 bg-[#fff]"
                    id="category_field"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="flex flex-col my-6">
                  <button
                    id="login_button"
                    type="submit"
                    className="bg-[#003171] w-1/4 py-3 text-white rounded my-6"
                  >
                    Update User
                  </button>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
