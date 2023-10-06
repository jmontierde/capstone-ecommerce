import React, { useState, useEffect } from "react";
import { FaHtml5, FaStar } from "react-icons/fa";

const CreateReview = ({ user, product, reviewHandler }) => {
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modal);
  };
  // Ratings
  const [rating, setRating] = useState(product.ratings || 0);
  const [hover, setHover] = useState(0);
  const productRating = Math.floor(rating);
  const handleClick = (newRating) => {
    setRating(newRating);
  };

  const handleMouseOver = (newHover) => {
    setHover(newHover);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  return (
    <div className="w-full my-6">
      {user ? (
        // <!-- Modal toggle -->
        <>
          <button
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="block text-white bg-blue-700 mb-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            onClick={handleModal}
          >
            Review
          </button>
          {modal ? (
            <div id="defaultModal" tabindex="-1" aria-hidden="true">
              <div className=" w-full max-w-2xl ">
                {/* <!-- Modal content --> */}
                <div className="relative h-full bg-white rounded-lg shadow dark:bg-gray-700">
                  {/* <!-- Modal header --> */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Review
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={handleModal}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* <!-- Modal body --> */}
                  <div className="p-6  flex">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <FaStar
                          key={ratingValue}
                          color={
                            ratingValue <= (hover || rating)
                              ? "#ffc107 "
                              : "#e4e5e9"
                          }
                          size={40}
                          onClick={() => handleClick(ratingValue)}
                          onMouseOver={() => handleMouseOver(ratingValue)}
                          onMouseLeave={() => handleMouseLeave()}
                          className="cursor-pointer"
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center">
                    <textarea
                      name="review"
                      id="review"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full mx-6 border-1 h-48 bg-[#ffffff73] "
                    />
                  </div>

                  {/* <!-- Modal footer --> */}
                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      data-modal-hide="defaultModal"
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={reviewHandler}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h1></h1>
          )}
        </>
      ) : (
        <h5 className=" font-semibold text-2xl py-3 px-6 w-1/2 rounded text-center">
          Login to post your review.
        </h5>
      )}
    </div>
  );
};

export default CreateReview;
