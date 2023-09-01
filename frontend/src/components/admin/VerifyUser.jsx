import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers, verifyUser, deleteUser } from "../../actions/userActions";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VERIFY_USER_RESET } from "../../constants/userConstant";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import { useNavigate } from "react-router-dom";
const VerifyUser = () => {
  const { users, loading, isUpdated, error } = useSelector(
    (state) => state.allUsers
  );
  const { isDeleted } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully");
      navigate("/admin/verify/:userId");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, isUpdated, isDeleted]);

  const handleVerify = (userId, verificationStatus) => {
    dispatch(verifyUser(userId, verificationStatus));
    console.log("VERIFY", verificationStatus);
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div>
      <h2 className="text-center">Verify User Account</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex  container mx-auto px-6 w-full">
          <Sidebar />
          <div className="flex w-10/12 items-center justify-center">
            <ToastContainer />

            <table className="table-auto w-full h-32 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">No.</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact No.</th>
                  <th className="px-4 py-2">Valid Id</th>
                  <th className="px-4 py-2">Selfie with Valid Id</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.phoneNumber}</td>
                    <td className="border px-4 py-2">
                      {user.validId && user.validId.url && (
                        <img
                          src={user.validId.url}
                          alt="Valid ID"
                          className="w-24 mx-auto"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {user.withBirthdayId && user.withBirthdayId.url && (
                        <img
                          src={user.withBirthdayId.url}
                          alt="withBirthdayId"
                          className="w-24 mx-auto"
                        />
                      )}
                    </td>
                    <td className="border  py-2 space-x-3">
                      {user.verificationStatus === "Pending" && (
                        <button
                          className="bg-green-500 text-white px-6 py-2"
                          onClick={() => handleVerify(user._id, "Verified")}
                        >
                          Verify
                        </button>
                      )}

                      {user.verificationStatus === "Pending" && (
                        <button
                          className="bg-red-500 text-white px-6 py-2"
                          onClick={() => deleteUserHandler(user._id)}
                          // onClick={() => handleVerify(user._id, "Rejected")}
                        >
                          Reject
                        </button>
                      )}
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

export default VerifyUser;
