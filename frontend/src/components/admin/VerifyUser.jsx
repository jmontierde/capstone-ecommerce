import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { allUsers, verifyUser } from "../../actions/userActions";

const VerifyUser = () => {
  const { users, loading } = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  console.log("USERS", users);

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  const handleVerify = (userId, verificationStatus) => {
    dispatch(verifyUser(userId, verificationStatus));
  };

  return (
    <div>
      <h2>Verify User Account</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>User List</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Verification Status: {user.verificationStatus}</p>
                {user.verificationStatus === "Pending" && (
                  <button onClick={() => handleVerify(user._id, "Verified")}>
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VerifyUser;
