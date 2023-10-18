import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTerms,
  updateTerm,
  deleteTerm,
  clearErrors,
} from "../../actions/termsActions";
import {
  DELETE_TERMS_RESET,
  UPDATE_TERMS_RESET,
} from "../../constants/termsConstant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
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
  Checkbox,
} from "@material-tailwind/react";
import { createTerms } from "../../actions/termsActions";
import { Link } from "react-router-dom";
import { CREATE_TERMS_RESET } from "../../constants/termsConstant";

const UpdateTerms = () => {
  const { termsAndConditions } = useSelector((state) => state.terms);
  const { isDeleted, isUpdated } = useSelector((state) => state.term);
  const { success, loading, error } = useSelector((state) => state.newTerm);
  const [editIndex, setEditIndex] = useState(-1);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track edit state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const handleAddTerms = (e) => {
    e.preventDefault();
    // Split the content by double pipe delimiter '||' into an array
    const contentArray = content.split("||").map((item) => item.trim());
    dispatch(createTerms(title, contentArray));
    setTitle("");
    setContent("");
  };

  console.log("A", termsAndConditions);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTerms());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Term deleted successfully");
      dispatch({ type: DELETE_TERMS_RESET });
    }

    if (isUpdated) {
      console.log("Success", success);

      toast.success("Term updated successfully");
      dispatch({ type: UPDATE_TERMS_RESET });
    }

    if (success) {
      navigate("/admin/maintenance/update/term");
      console.log("A");
      toast.success("Term and Condition created successfully");
      dispatch({ type: CREATE_TERMS_RESET }); // Dispatch the reset action
    }
  }, [dispatch, error, isDeleted, isUpdated, success, toast]);

  const deleteTermHandler = (id) => {
    dispatch(deleteTerm(id));
  };

  const handleUpdate = (id) => {
    const updatedFields = {};
    if (updatedTitle) {
      updatedFields.title = updatedTitle;
    }
    if (updatedContent) {
      updatedFields.content = updatedContent;
    }

    if (Object.keys(updatedFields).length > 0) {
      dispatch(updateTerm(id, updatedFields));
    }
    console.log("Updating term with ID:", id);
    console.log("Updated fields:", updatedFields);
    setEditIndex(-1);
    setUpdatedTitle("");
    setUpdatedContent("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditIndex(-1);
    setUpdatedTitle("");
    setUpdatedContent("");
    setIsEditing(false);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  const [masterCheckboxChecked, setMasterCheckboxChecked] = useState(false);
  const [selectedtermsAndConditions, setSelectedtermsAndConditions] = useState(
    []
  );

  const deleteSelectedtermsAndConditions = () => {
    if (selectedtermsAndConditions.length > 0) {
      selectedtermsAndConditions.forEach((termId) => {
        deleteTermHandler(termId);
      });
      setSelectedtermsAndConditions([]);
    } else {
      alert("Please select termsAndConditions to delete.");
    }
  };

  const TABLE_HEAD = ["No.", "Terms and Conditions", "Actions"];

  // Filter termsAndConditions based on searchQuery
  const filteredTerms = termsAndConditions
    ? termsAndConditions.filter((term) =>
        term.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTerms.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col lg:flex-row   ">
      <Sidebar />

      <div className="flex flex-col container  py-3 lg:py-0 mx-auto">
        <Card className="h-full ">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h4" color="blue-gray">
                  Terms and Conditions
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all Terms and Conditions
                </Typography>
              </div>
            </div>
            <Card color="transparent" shadow={false} className="my-3 ">
              <Typography variant="h5" color="blue-gray" className="text-lg">
                Create Terms and Conditions
              </Typography>

              <form
                className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
                onSubmit={handleAddTerms}
              >
                <div className="mb-4 flex flex-col gap-6">
                  <div className="w-96">
                    <Input
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="w-96">
                    <div className="relative w-full min-w-[200px]">
                      <textarea
                        className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" "
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      ></textarea>
                      <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Content (use '||' as delimiter for messages)
                      </label>
                    </div>
                  </div>
                </div>
                <Button className="mt-6 bg-[#000]" fullWidth type="submit">
                  Submit
                </Button>
              </form>
            </Card>
            <div className="flex items-center justify-between">
              <button
                className="bg-red-500 text-white px-3 py-2 rounded w-96"
                onClick={deleteSelectedtermsAndConditions}
              >
                Delete Selected termsAndConditions
              </button>
              <div className="relative w-full md:w-72 mr-6">
                {/* <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-3 py-2  rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> */}
                <Input
                  label="Search"
                  value={searchQuery}
                  className="w-full "
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          {/* Create New Terms */}

          {/* // */}
          <CardBody className="overflow-scroll px-0 ">
            <table className="mt-4 w-full border-collapse table-auto text-left ">
              <thead>
                <tr>
                  <th className="cursor-pointer bterm-y bterm-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 ">
                    <input
                      type="checkbox"
                      checked={
                        selectedtermsAndConditions.length ===
                        termsAndConditions.length
                      }
                      onChange={() => {
                        if (
                          selectedtermsAndConditions.length ===
                          termsAndConditions.length
                        ) {
                          setSelectedtermsAndConditions([]);
                        } else {
                          setSelectedtermsAndConditions(
                            termsAndConditions.map((term) => term._id)
                          );
                        }
                      }}
                    />
                  </th>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className="cursor-pointer  bterm-y bterm-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 "
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
                {currentItems.map((term, index) => {
                  const isLast = index === termsAndConditions.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 bterm-b bterm-blue-gray-50";

                  return (
                    <tr key={term.name}>
                      <td className={classes}>
                        <input
                          type="checkbox"
                          checked={
                            masterCheckboxChecked ||
                            selectedtermsAndConditions.includes(term._id)
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedtermsAndConditions([
                                ...selectedtermsAndConditions,
                                term._id,
                              ]);
                            } else {
                              setSelectedtermsAndConditions(
                                selectedtermsAndConditions.filter(
                                  (id) => id !== term._id
                                )
                              );
                            }
                          }}
                        />
                      </td>
                      <td className={`${classes} text-center`}>
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
                      {editIndex === index ? (
                        <div className="">
                          <input
                            type="text"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            placeholder="Updated Title"
                            className="border border-black w-1/2 py-3 p-3"
                          />
                          <input
                            type="text"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            placeholder="Updated Content"
                            className="border border-black w-1/2 py-3 p-3"
                          />
                        </div>
                      ) : (
                        <div className="my-3">
                          <h1 className="font-bold">{term.title}</h1>
                          {/* Check if term.content is a string before splitting */}
                          {term.content.map((item, itemIndex) => (
                            <p key={itemIndex}>{item}</p>
                          ))}
                        </div>
                      )}
                      <td className={`${classes} `}>
                        {editIndex === index ? (
                          <div className="flex items-center space-x-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="green"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => handleUpdate(term._id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                              />
                            </svg>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="red"
                              className="w-6 h-6 cursor-pointer"
                              onClick={handleCancel}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-6">
                            <Tooltip content="Edit term" className="bg-[#000]">
                              <PencilIcon
                                className="h-8 w-8 cursor-pointer"
                                onClick={() => setEditIndex(index)}
                              />
                            </Tooltip>
                            <img
                              src="/images/deleteHover.png"
                              alt="View term"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => deleteTermHandler(term._id)}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between bterm-t bterm-blue-gray-50 p-4">
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
    </div>
  );
};

export default UpdateTerms;
