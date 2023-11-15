import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductReviews,
  deleteReview,
  clearErrors,
} from "../../actions/productActions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { MDBDataTable } from "mdbreact";
import { useAlert } from "react-alert";
import { GET_REVIEWS_FAIL } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";

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

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, reviews } = useSelector((state) => state.productReviews);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review
  );

  console.log("reviewsreviews", reviews);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      navigate("/admin/reviews");
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (productId) {
      dispatch(getProductReviews(productId));
    }

    if (!productId) {
      alert.error("Product Id ");
      navigate("/admin/reviews");
    }

    if (isDeleted) {
      alert.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, error, productId, isDeleted, deleteError]);

  console.log("PRODUCT REVIEW ID ", productId);

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(productId, reviewId));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!productId) {
      alert.error("Product Id ");
      navigate("/admin/reviews");
    }

    dispatch(getProductReviews(productId));
  };
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const TABLE_HEAD = [
    "No.",
    "Review ID",
    "Rating",
    "Comment",
    "User",
    "Actions",
  ];

  // Filter reviews based on searchQuery
  const filteredOrders = reviews
    ? reviews.filter((review) =>
        review._id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const deleteSelectedReviews = () => {
    if (selectedReviews.length > 0) {
      selectedReviews.forEach((reviewId) => {
        deleteReviewHandler(reviewId);
      });
      setSelectedReviews([]);
    } else {
      alert("Please select reviews to delete.");
    }
  };

  return (
    <div>
      <MetaData title={"Product Reviews"} />
      <div className="flex flex-col lg:flex-row ">
        <Sidebar />

        <div className="w-full max-h-screen mt-20">
          <div className="flex justify-center  items-center my-12">
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="w-96 ">
                <Input
                  label="Product Id"
                  type="text"
                  id="productId_field"
                  className="w-full"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <button
                id="search_button"
                type="submit"
                className="bg-[#4F46E5] w-full text-white rounded py-2 px-6 "
              >
                SEARCH
              </button>
            </form>
          </div>

          <ToastContainer />

          {error && error !== GET_REVIEWS_FAIL && (
            <div className="mt-3 alert alert-danger">{error}</div>
          )}

          {reviews ? (
            reviews.length > 0 ? (
              <Card className="h-auto w-full">
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="rounded-none"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <Typography variant="h5" color="blue-gray">
                        Reviews List
                      </Typography>
                      <Typography color="gray" className="mt-1 font-normal">
                        See information about all reviews
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-red-500 text-white px-3 py-3 lg:py-2 text-xs rounded lg:text-base"
                      onClick={deleteSelectedReviews}
                    >
                      Delete Selected reviews
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

                <CardBody className="px-0">
                  <table className="mt-4 w-full min-w-max table-auto text-left ">
                    <thead>
                      <tr>
                        <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-center">
                          <input
                            type="checkbox"
                            checked={selectedReviews.length === reviews.length}
                            onChange={() => {
                              if (selectedReviews.length === reviews.length) {
                                setSelectedReviews([]);
                              } else {
                                setSelectedReviews(
                                  reviews.map((review) => review._id)
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
                              className="flex items-center  justify-between gap-2 font-normal leading-none opacity-70  "
                            >
                              {head}{" "}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((review, index) => {
                        const isLast = index === reviews.length - 1;
                        const classes = isLast
                          ? "p-4"
                          : "p-4 border-b border-blue-gray-50 ";

                        return (
                          <tr key={review.name}>
                            <td className={`${classes} text-center`}>
                              <input
                                type="checkbox"
                                checked={
                                  masterCheckboxChecked ||
                                  selectedReviews.includes(review._id)
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrders([
                                      ...selectedReviews,
                                      review._id,
                                    ]);
                                  } else {
                                    setSelectedOrders(
                                      selectedReviews.filter(
                                        (id) => id !== review._id
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
                                  {review.reviewId}
                                </Typography>
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {review.rating}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {review.comment}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {`${review.firstName} ${review.lastName}`}
                              </Typography>
                            </td>
                            <td
                              className={`${classes} flex items-center space-x-6`}
                            >
                              <img
                                src="/images/deleteHover.png"
                                alt="View review"
                                className="w-6 h-6 cursor-pointer"
                                onClick={() => deleteReviewHandler(review._id)}
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
            ) : (
              <p className="mt-5 text-center">No Reviews.</p>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
