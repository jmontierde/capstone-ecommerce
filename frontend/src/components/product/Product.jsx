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
        <div className="w-full h-2/4">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-2/3 h-52 mx-auto"
            />
          )}
          <h2>{product.name}</h2>
          <div className="flex items-center justify-center mx-auto">
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
          </div>
          <h5 className="text-xl text-center mb-6">₱{product.price}</h5>
        </div>
      </>
    </Link>
  );
};

export default Product;