// CreateTerm.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTerms } from "../../actions/termsActions";
import Sidebar from "./Sidebar";
const CreateTerm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Split the content by double pipe delimiter '||' into an array
    const contentArray = content.split("||").map((item) => item.trim());

    // Dispatch the createTerms action with the title and content array
    dispatch(createTerms(title, contentArray));

    // Reset the form or perform any other necessary actions after creating terms.
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <div className="flex  container mx-auto px-6">
        <Sidebar />
        <div className="bg-[#ae7373] w-10/12 ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center bg-[#b09c9c] w-1/2 h-full mx-auto space-y-6"
          >
            <h2>Create New Terms and Conditions</h2>

            <div className=" flex flex-col justify-center items-center space-y-3 mx-auto w-full">
              <label htmlFor="title" className=" text-center w-1/6">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="py-1 w-5/6"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="text-center w-full">
              <label htmlFor="content" className=" w-1/6 ">
                Content (use '||' as delimiter for messages)
              </label>
              <textarea
                id="content"
                className="w-5/6  h-72"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-green-500 px-6 rounded py-2">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTerm;
