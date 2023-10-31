import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Sidebar from "../admin/Sidebar";
import Loader from "../layout/Loader";
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
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors, deleteOrder } from "../../actions/orderActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { isDeleted } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order deleted successfully");
      navigate("/orders/me");
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isDeleted]);

  console.log("MY ORDER", orders);

  // Pagination
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };
  const deleteSelectedOrders = () => {
    if (selectedOrders.length > 0) {
      selectedOrders.forEach((orderId) => {
        deleteOrderHandler(orderId);
      });
      setSelectedOrders([]);
    } else {
      alert("Please select orders to delete.");
    }
  };

  const TABLE_HEAD = [
    "No.",
    "Order Id",
    "Num of Items",
    "Amount",
    "Status",
    "Actions",
  ];

  // Filter orders based on searchQuery
  const filteredOrders = orders
    ? orders.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex container mx-auto">
          <ToastContainer />
          <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    My Orders
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal">
                    See information about all orders
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-red-500 text-white px-3 py-3 lg:py-2 text-xs rounded lg:text-base"
                  onClick={deleteSelectedOrders}
                >
                  Delete Selected orders
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
                        checked={selectedOrders.length === orders.length}
                        onChange={() => {
                          if (selectedOrders.length === orders.length) {
                            setSelectedOrders([]);
                          } else {
                            setSelectedOrders(orders.map((order) => order._id));
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
                  {currentItems.map((order, index) => {
                    const isLast = index === orders.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={order.name}>
                        <td className={classes}>
                          <input
                            type="checkbox"
                            checked={
                              masterCheckboxChecked ||
                              selectedOrders.includes(order._id)
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrders([
                                  ...selectedOrders,
                                  order._id,
                                ]);
                              } else {
                                setSelectedOrders(
                                  selectedOrders.filter(
                                    (id) => id !== order._id
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
                              {order._id}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {order.orderItems.length}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {order.totalPrice}
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
                                order.orderStatus === "Delivered"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </Typography>
                        </td>
                        <td
                          className={`${classes} flex items-center space-x-6`}
                        >
                          <Link to={`/order/${order._id}`}>
                            <Tooltip content="Edit order" className="bg-[#000]">
                              <PencilIcon className="h-4 w-4" />
                            </Tooltip>
                          </Link>

                          <img
                            src="/images/deleteHover.png"
                            alt="View order"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => deleteOrderHandler(order._id)}
                          />
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
                Page {currentPage} of {totalPages === 1 ? 1 : totalPages}
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
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
