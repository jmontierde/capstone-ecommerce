import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const UpdateTerms = () => {
  const { termsAndConditions, loading, error } = useSelector(
    (state) => state.terms
  );

  const { isDeleted, isUpdated } = useSelector((state) => state.term);

  const [editIndex, setEditIndex] = useState(-1);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track edit state

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
      toast.success("Term updated successfully");
      dispatch({ type: UPDATE_TERMS_RESET });
    }
  }, [dispatch, error, isDeleted, isUpdated]);

  const deleteTermHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      dispatch(deleteTerm(id));
    }
  };

  const handleUpdate = (id) => {
    // Only send the fields that have been updated
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

    setEditIndex(-1); // Clear the edit state
    setUpdatedTitle(""); // Clear the input field for title
    setUpdatedContent(""); // Clear the input field for content
    setIsEditing(false); // Clear the edit state
  };

  const handleCancel = () => {
    setEditIndex(-1); // Clear the edit state
    setUpdatedTitle(""); // Clear the input field for title
    setUpdatedContent(""); // Clear the input field for content
    setIsEditing(false); // Clear the edit state
  };

  return (
    <div className="flex container mx-auto px-6">
      <Sidebar />

      <div className="flex w-10/12 justify-center ">
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : (
          <table className="table-fixed w-full">
            <thead className="bg-[#ECEFF1]">
              <tr>
                <th className="px-4 py-2 w-1/2">Terms and Conditions</th>
                <th className="px-4 py-2 w-1/2">Action</th>
              </tr>
            </thead>
            <tbody>
              {termsAndConditions.map((term, index) => (
                <tr key={term._id}>
                  <td className="">
                    {editIndex === index ? (
                      <>
                        <input
                          type="text"
                          value={updatedTitle}
                          onChange={(e) => setUpdatedTitle(e.target.value)}
                          placeholder="Updated Title"
                        />
                        <input
                          type="text"
                          value={updatedContent}
                          onChange={(e) => setUpdatedContent(e.target.value)}
                          placeholder="Updated Content"
                        />
                      </>
                    ) : (
                      <div className="bg-green-300">
                        <h1>{term.title}</h1>
                        <p>{term.content}</p>
                      </div>
                    )}
                  </td>
                  <td className=" bg-green-200 text-center px-4 py-2 space-x-3">
                    {editIndex === index ? (
                      <>
                        <button onClick={() => handleUpdate(term._id)}>
                          Save
                        </button>
                        <button onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditIndex(index)}>
                          Edit
                        </button>
                        <button onClick={() => deleteTermHandler(term._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UpdateTerms;
