import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { allUsers, deleteUser, clearErrors } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { isDeleted } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, alert, error, isDeleted, history]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);

  const deleteSelectedUsers = () => {
    if (selectedUsers.length > 0) {
      selectedUsers.forEach((userId) => {
        deleteUser(userId);
      });
      setSelectedUsers([]);
    } else {
      toast("Please select orders to delete.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">My users</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto px-12">
          <Sidebar />
          <div className="flex flex-col h-full w-10/12 justify-center ">
            <ToastContainer />
            <div className="flex justify-start mt-4">
              <button
                className="bg-red-500 text-white px-3 py-2"
                onClick={deleteSelectedUsers}
              >
                Delete Selected Products
              </button>
            </div>
            <table className="tablew-full h-32">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={masterCheckboxChecked}
                      onChange={() => {
                        if (masterCheckboxChecked) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(users.map((user) => user._id));
                        }
                        setMasterCheckboxChecked(!masterCheckboxChecked);
                      }}
                    />
                  </th>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={
                          masterCheckboxChecked ||
                          selectedUsers.includes(user._id)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user._id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-3">{user._id}</td>
                    <td className="border px-4 py-3">{user.name}</td>
                    <td className="border px-4 py-3">{user.email}</td>
                    <td className="border px-4 py-3">{user.role}</td>
                    <td className="border px-4 py-3">
                      <div className="flex justify-center items-center space-x-3">
                        <Link to={`/admin/user/${user._id}`}>
                          <img
                            src="/images/eye-solid.svg"
                            alt="View user"
                            className="w-6 h-6 mx-auto"
                          />
                        </Link>
                        <img
                          src="/images/deleteHover.png"
                          alt="View user"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteUserHandler(user._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
