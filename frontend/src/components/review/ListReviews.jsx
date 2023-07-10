import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const ListReviews = ({ reviews }) => {
  console.log(reviews);

  // Need to add profile pic in back end
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-6 w-75">
      <h3>Customer Reviews</h3>
      <hr />
      {reviews &&
        reviews.map((review) => {
          const rating = review.rating || 0;

          return (
            <div key={review._id}>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <FaStar
                      key={ratingValue}
                      color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                      size={20}
                      className="cursor-pointer"
                    />
                  );
                })}
              </div>
              <div className="flex items-center my-3">
                <img
                  src={user.avatar.url}
                  className="rounded-full w-12 h-12 mr-3"
                  alt="avatar"
                />
                <p>{review.name}</p>
              </div>

              <p>{review.comment}</p>

              <hr />
            </div>
          );
        })}
    </div>
  );
};

export default ListReviews;
