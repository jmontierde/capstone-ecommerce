import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers, verifyUser, deleteUser } from "../../actions/userActions";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VERIFY_USER_RESET } from "../../constants/userConstant";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import { useNavigate, Link } from "react-router-dom";
import ImageModal from "../layout/ImageModal";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
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
    if (verificationStatus === "Verified") {
      toast.success("User verified successfully");
      dispatch({ type: VERIFY_USER_RESET });
    }
    console.log("VERIFY", verificationStatus);
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };
  const [selectedUser, setSelectedUser] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);

  const deleteSelectedUsers = () => {
    if (selectedUser.length > 0) {
      selectedUser.forEach((productId) => {
        deleteUserHandler(productId);
      });
      setSelectedProducts([]);
    } else {
      toast("Please select orders to delete.");
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  const filteredVerifyUser = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    return (
      ((user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (fullName &&
          fullName.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      user.verificationStatus === "Pending"
    ); // Filter by "Pending" verification status
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVerifyUser.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const TABLE_HEAD = [
    "No.",
    "Name",
    "Email",
    "Contact No.",
    "Valid Id",
    "Selfie with Valid Id	",
    { label: "Action", width: "120px" }, // Adjust the width as needed
  ];

  // Zoom Image
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);

  const openImageModal = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
  };

  const closeImageModal = () => {
    setEnlargedImageUrl(null);
  };
  console.log("A", users);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col lg:flex-row ">
          <Sidebar />
          <div className="w-full">
            <Card className="h-full w-full">
              <CardHeader
                floated={false}
                shadow={false}
                className="rounded-none"
              >
                <div className="mb-8 flex items-center justify-between gap-8">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Verify User Account
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                      See information about all users
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-red-500 text-white px-3 py-3 lg:py-2 text-xs rounded lg:text-base"
                    onClick={deleteSelectedUsers}
                  >
                    Delete Selected users
                  </button>
                  <div className="relative lg:w-72 w-48 lg:mr-6">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 absolute top-3 left-3 text-gray-400" />
                  </div>
                </div>
              </CardHeader>

              <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 ">
                        <input
                          type="checkbox"
                          checked={selectedUser.length === users.length}
                          onChange={() => {
                            if (selectedUser.length === users.length) {
                              setSelectedUser([]);
                            } else {
                              setSelectedUser(users.map((user) => user._id));
                            }
                          }}
                        />
                      </th>
                      {TABLE_HEAD.map((head, index) => (
                        <th
                          key={head.label ? head.label : head}
                          className={`cursor-pointer  border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 ${
                            head.label ? `w-${head.width}` : "" // Apply width if specified
                          }`}
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center  justify-between gap-2 font-normal leading-none opacity-70"
                          >
                            {head.label ? head.label : head}{" "}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user, index) => {
                      const isLast = index === users.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";
                      console.log("A", user);

                      return (
                        <tr key={user.name}>
                          <td className={classes}>
                            <input
                              type="checkbox"
                              checked={
                                masterCheckboxChecked ||
                                selectedUser.includes(user._id)
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUser([...selectedUser, user._id]);
                                } else {
                                  setSelectedUser(
                                    selectedUser.filter((id) => id !== user._id)
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {index + 1}
                                </Typography>
                              </div>
                            </div>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {`${user.firstName} ${user.lastName}`}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.email}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.phoneNumber}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.validId && user.validId.url && (
                                <img
                                  src={user.validId.url}
                                  alt="Valid ID"
                                  className="w-16 h-16 mx-auto"
                                  onClick={() =>
                                    openImageModal(user.validId.url)
                                  }
                                />
                              )}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {user.withBirthdayId &&
                                user.withBirthdayId.url && (
                                  <img
                                    src={user.withBirthdayId.url}
                                    alt="withBirthdayId"
                                    className="w-16  h-16 mx-auto"
                                    onClick={() =>
                                      openImageModal(user.withBirthdayId.url)
                                    }
                                  />
                                )}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex items-center space-x-2">
                              {user.verificationStatus === "Pending" && (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="green"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="white"
                                    className="w-12 h-12 cursor-pointer"
                                    onClick={() =>
                                      handleVerify(user._id, "Verified")
                                    }
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                    />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="red"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="white"
                                    className="w-12 h-12 cursor-pointer"
                                    onClick={() => deleteUserHandler(user._id)}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </>
                              )}
                              {!user.verificationStatus && <div></div>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
              <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredVerifyUser.length / itemsPerPage)}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredVerifyUser.length / itemsPerPage)
                    }
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      {enlargedImageUrl && (
        <ImageModal imageUrl={enlargedImageUrl} onClose={closeImageModal} />
      )}
    </div>
  );
};

export default VerifyUser;
