import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Product = ({ product }) => {
  const [rating, setRating] = useState(product.ratings || 0);
  const [hover, setHover] = useState(0);

  console.log("Ratings", rating);

  // const handleClick = (newRating) => {
  //   setRating(newRating);
  // };

  // const handleMouseOver = (newHover) => {
  //   setHover(newHover);
  // };

  // const handleMouseLeave = () => {
  //   setHover(0);
  // };

  return (
    <Link to={`/product/${product._id}`}>
      <>
        <div className="w-full space-y-1 h-full  ">
          <div className="px-6 lg:px-0">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-72 h-72 py-8  mx-auto bg-[#F8F8F8]"
              />
            )}
            <h2 className="text-center lg:text-left text-base md:px-12 lg:px-0">
              {product.name}
            </h2>
            {/* <div className="flex items-center justify-center mx-auto">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={ratingValue}
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107 " : "#e4e5e9"
                  }
                  size={20}
                />
              );
            })}
            <p className="pl-1">({product.numOfReviews})</p>
          </div> */}
            <h5 className="text-sm text-center lg:text-left md:px-12 lg:px-0 ">
              ₱{product.price}
            </h5>
          </div>
        </div>
      </>
    </Link>
  );
};

export default Product;
