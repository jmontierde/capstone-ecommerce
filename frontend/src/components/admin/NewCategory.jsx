import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
  newCategory,
  clearErrors,
  updateCategory,
} from "../../actions/productActions";
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

import {
  DELETE_CATEGORY_RESET,
  NEW_CATEGORY_RESET,
  UPDATE_CATEGORY_RESET,
} from "../../constants/productConstants";

const NewCategory = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, categories } = useSelector(
    (state) => state.categories
  );
  const { isDeleted, isUpdated } = useSelector((state) => state.category);

  const { success } = useSelector((state) => state.newCategory);

  console.log("UPDATE?", isUpdated);

  useEffect(() => {
    dispatch(getCategories());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully");
      navigate("/admin/maintenance/category");
      dispatch({ type: DELETE_CATEGORY_RESET });
    }

    if (isUpdated) {
      toast.success("Category updated successfully");
      navigate("/admin/maintenance/category");
      dispatch({ type: UPDATE_CATEGORY_RESET });
    }

    if (success) {
      dispatch({ type: NEW_CATEGORY_RESET });
      navigate("/admin/maintenance/category");
      toast.success("Added new category");
    }
  }, [dispatch, alert, error, isDeleted, success, isUpdated, toast]);

  const deleteCategoryHandler = (id) => {
    dispatch(deleteCategory(id));
  };
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const deleteSelectedRefunds = () => {
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((refundId) => {
        deleteCategoryHandler(refundId);
      });
      setSelectedCategories([]);
    } else {
      alert("Please select refunds to delete.");
    }
  };

  const [categoryName, setCategoryName] = useState("");
  const addCategoryHandler = () => {
    const categoryData = {
      name: categoryName,
    };
    dispatch(newCategory(categoryData)); // Dispatch the newCategory action
    setCategoryName(""); // Clear the input field after adding
  };

  // Create an array to track edit states for each category
  const [editStates, setEditStates] = useState([]);

  useEffect(() => {
    // Initialize edit states array with `false` for each category
    setEditStates(new Array(categories.length).fill(false));
  }, [categories]);
  // Function to toggle edit state for a specific category
  const toggleEditState = (index) => {
    const newEditStates = [...editStates];
    newEditStates[index] = !newEditStates[index];
    setEditStates(newEditStates);
  };

  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const handleUpdate = (index, categoryId) => {
    dispatch(updateCategory(categoryId, { name: updatedCategoryName }));
    setUpdatedCategoryName("");
  };
  const TABLE_HEAD = ["No.", "Category", "Action"];

  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter categories based on searchQuery
  const filteredOrders = categories
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <ToastContainer />

      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col lg:flex-row ">
          <Sidebar />
          <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Category list
                  </Typography>
                  <Typography color="gray" className="mt-1 font-normal">
                    See information about all categories
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col space-y-6 items-start justify-between">
                <div className="space-x-3 ">
                  <input
                    type="text"
                    placeholder="Add Category"
                    className="pl-3 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <Button className="bg-[#000]" onClick={addCategoryHandler}>
                    Add Category
                  </Button>
                </div>
                <div className="flex flex-col lg:flex-row justify-between space-y-3 lg:space-y-0 w-full">
                  <button
                    className="bg-red-500 text-white px-3 py-3 lg:py-2 text-xs rounded lg:text-base"
                    onClick={deleteSelectedRefunds}
                  >
                    Delete Selected Products
                  </button>
                  <div className="relative lg:w-72 w-full lg:mr-6">
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
              </div>
            </CardHeader>

            <CardBody className="overflow-scroll px-0">
              <table className="mt-4 w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 ">
                      <input
                        type="checkbox"
                        checked={
                          selectedCategories.length === categories.length
                        }
                        onChange={() => {
                          if (selectedCategories.length === categories.length) {
                            setSelectedCategories([]);
                          } else {
                            setSelectedCategories(
                              categories.map((category) => category._id)
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
                  {currentItems.map((category, index) => {
                    const isLast = index === categories.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={category.name}>
                        <td className={classes}>
                          <input
                            type="checkbox"
                            checked={
                              masterCheckboxChecked ||
                              selectedCategories.includes(category._id)
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  category._id,
                                ]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (id) => id !== category._id
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
                              {category.name}
                            </Typography>
                          </div>
                        </td>

                        <td className={`${classes} flex space-x-3`}>
                          {editStates[index] ? (
                            <>
                              <input
                                type="text"
                                id="editCategory"
                                className="border border-[#000]"
                                value={updatedCategoryName} // Bind input value to state
                                onChange={(e) =>
                                  setUpdatedCategoryName(e.target.value)
                                }
                              />
                              <button
                                className="bg-[#359d56] text-white px-6 rounded"
                                onClick={() =>
                                  handleUpdate(index, category._id)
                                }
                              >
                                Add
                              </button>
                            </>
                          ) : (
                            <h1></h1>
                          )}
                          <Tooltip content="Edit user" className="bg-[#000]">
                            <PencilIcon
                              className="h-4 w-4"
                              onClick={() => toggleEditState(index)}
                            />
                          </Tooltip>
                          <div className="flex items-center space-x-2">
                            <img
                              src="/images/deleteHover.png"
                              alt="View category"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() =>
                                deleteCategoryHandler(category._id)
                              }
                            />
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
    </>
  );
};

export default NewCategory;
