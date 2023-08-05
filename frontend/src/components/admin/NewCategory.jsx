import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("User deleted successfully");
      navigate("/admin/maintenance/category");
      dispatch({ type: DELETE_CATEGORY_RESET });
    }

    if (isUpdated) {
      alert.success("Category updated successfully");
      navigate("/admin/maintenance/category");
      dispatch({ type: UPDATE_CATEGORY_RESET });
    }

    if (success) {
      dispatch({ type: NEW_CATEGORY_RESET });
    }
  }, [dispatch, alert, error, isDeleted, success, isUpdated]);

  const deleteCategoryHandler = (id) => {
    dispatch(deleteCategory(id));
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
    setUpdatedCategoryName(""); // Fix the typo here
  };

  return (
    <div className="">
      <div className="container px-16 my-auto mb-6 ml-auto w-10/12 flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 ">Categories</h1>
        <div className="space-x-3">
          <input
            type="text"
            id="category"
            className="border py-2 rounded w-72  border-[#000]"
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button
            className=" bg-[#8F7930] rounded px-3 py-2"
            onClick={addCategoryHandler}
          >
            Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex  container mx-auto px-6">
          <Sidebar />

          <div className="flex w-10/12 justify-center ">
            <table className="table-fixed w-full h-32">
              <thead className="bg-[#ECEFF1]">
                <tr>
                  <th className="px-4 py-2">Category Name</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td className="border px-4 py-3">{category.name}</td>

                    <td className="border px-4 py-3">
                      <div className="flex justify-center items-center space-x-3">
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
                              onClick={() => handleUpdate(index, category._id)}
                            >
                              Add
                            </button>
                          </>
                        ) : (
                          <h1></h1>
                        )}
                        <img
                          src="/images/edit.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => toggleEditState(index)}
                        />
                        <img
                          src="/images/deleteHover.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteCategoryHandler(category._id)}
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

export default NewCategory;
