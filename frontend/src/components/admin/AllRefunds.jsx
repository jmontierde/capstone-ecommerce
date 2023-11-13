import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  allRefund,
  deleteRefund,
  updateRefund,
} from "../../actions/orderActions"; // Import updateRefund action
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import ImageModal from "../layout/ImageModal";
import {
  DELETE_REFUND_RESET,
  UPDATE_REFUND_RESET,
} from "../../constants/orderConstants";
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
import { Link } from "react-router-dom";
const AllRefunds = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, refunds } = useSelector((state) => state.allRefund);
  const [selectedRefunds, setSelectedRefunds] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);
  const [status, setStatus] = useState(""); // Added status state

  const { isDeleted, isUpdated } = useSelector((state) => state.refund);

  console.log("refunds", refunds);

  useEffect(() => {
    dispatch(allRefund());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Refund deleted successfully");
      navigate("/admin/refunds");
      dispatch({ type: DELETE_REFUND_RESET });
    }
    if (isUpdated) {
      alert.success("Refund status updated successfully");
      dispatch({ type: UPDATE_REFUND_RESET }); // Reset the update state here
    }
  }, [dispatch, error, alert, isDeleted, isUpdated]);

  const openImageModal = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
  };

  const closeImageModal = () => {
    setEnlargedImageUrl(null);
  };

  const deleteRefundHandler = (id) => {
    dispatch(deleteRefund(id));
  };

  const deleteSelectedRefunds = () => {
    if (selectedRefunds.length > 0) {
      selectedRefunds.forEach((refundId) => {
        deleteRefundHandler(refundId);
      });
      setSelectedRefunds([]);
    } else {
      alert("Please select refunds to delete.");
    }
  };

  const handleStatusUpdate = (refundId) => {
    if (status.trim() === "") {
      alert("Please select a status.");
      return;
    }

    if (isUpdated) {
      alert.success("Refund status updated successfully");
      dispatch({ type: UPDATE_REFUND_RESET });
    }

    dispatch(updateRefund(refundId, { status }));
  };

  const TABLE_HEAD = [
    "No.",
    "Order Id",
    "Image Reason",
    "Reasons",
    "Other Reason",
    "Status",
    "Delete",
    "Update",
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter refunds based on searchQuery
  const filteredOrders = refunds
    ? refunds.filter((refund) =>
        refund._id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col lg:flex-row ">
          <Sidebar />
          <Card className="h-full w-full mt-20">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Refunds list
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal">
                    See information about all refunds
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-between gap-6">
                <button
                  className="bg-red-500 text-white px-3 py-3 lg:py-2 text-xs rounded lg:text-base"
                  onClick={deleteSelectedRefunds}
                >
                  Delete Selected Refunds
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
                        checked={selectedRefunds.length === refunds.length}
                        onChange={() => {
                          if (selectedRefunds.length === refunds.length) {
                            setSelectedRefunds([]);
                          } else {
                            setSelectedRefunds(
                              refunds.map((refund) => refund._id)
                            );
                          }
                        }}
                      />
                    </th>
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={head}
                        className="cursor-pointer  border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 "
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center  justify-between gap-2 font-normal leading-none opacity-70"
                        >
                          {head}{" "}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((refund, index) => {
                    console.log("REFUND", refund._id);
                    const isLast = index === refunds.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={refund.name}>
                        <td className={classes}>
                          <input
                            type="checkbox"
                            checked={
                              masterCheckboxChecked ||
                              selectedRefunds.includes(refund._id)
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRefunds([
                                  ...selectedRefunds,
                                  refund._id,
                                ]);
                              } else {
                                setSelectedRefunds(
                                  selectedRefunds.filter(
                                    (id) => id !== refund._id
                                  )
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
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {refund.orderId}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {refund.imageReason && refund.imageReason.url && (
                              <img
                                src={refund.imageReason.url}
                                alt="Image Reason"
                                className="w-16  h-16 cursor-pointer"
                                onClick={() =>
                                  openImageModal(refund.imageReason.url)
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
                            {refund.reasons}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {refund.otherReason}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <span
                              className={`${
                                refund.status === "accepted"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {refund.status}
                            </span>
                          </Typography>
                        </td>
                        <td className={`${classes} `}>
                          <div className="flex items-center space-x-2">
                            <img
                              src="/images/deleteHover.png"
                              alt="View refund"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => dispatch(deleteRefund(refund._id))}
                            />
                          </div>
                        </td>
                        <td className={`${classes} `}>
                          <div className="flex flex-col">
                            <select
                              className="border border-[#000] py-2 my-1 w-32 px-1 bg-[#fff]"
                              name="status"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <button
                              className="bg-[#2e69a8] rounded py-2 my-3 w-32 text-white px-6"
                              onClick={() => handleStatusUpdate(refund._id)}
                            >
                              Update
                            </button>
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
                {Math.ceil(filteredOrders.length / itemsPerPage)}
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
                    Math.ceil(filteredOrders.length / itemsPerPage)
                  }
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      {enlargedImageUrl && (
        <ImageModal imageUrl={enlargedImageUrl} onClose={closeImageModal} />
      )}
    </>
  );
};

export default AllRefunds;
