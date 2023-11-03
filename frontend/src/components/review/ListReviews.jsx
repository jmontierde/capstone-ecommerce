import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const ListReviews = ({ reviews }) => {
  console.log("Reviews in ListReviews:", reviews[0].avatar.url);

  return (
    <div className="container mx-auto px-6 w-75  py-6 space-y-3">
      <h3>Customer Reviews</h3>
      <hr />
      {reviews &&
        reviews.map((review) => {
          console.log("rev", review);
          const rating = review.rating || 0;

          return (
            <div key={review._id} className="space-y-3">
              <div className="flex items-center my-3 ">
                {review.avatar.url && review.avatar.url.length > 0 && (
                  <img
                    src={review.avatar.url}
                    alt={reviews.avatar}
                    className="rounded-full w-12 h-12 mr-3"
                  />
                )}
                <p>
                  {review.firstName} {""} {review.lastName}
                </p>
              </div>
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

              <p>{review.comment}</p>
            </div>
          );
        })}
      <hr />
    </div>
  );
};

export default ListReviews;
