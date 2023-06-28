import React, { Fragment, useState, useEffect } from "react";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
// import ListReviews from '../review/ListReviews'
import { FaStar } from "react-icons/fa";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import { addItemToCart } from "../../actions/cartActions";
const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  // const [comment, setComment] = useState('');

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  console.log(id);

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (error) {
      alert.error(error);
    }

    // if (reviewError) {
    //     alert.error(reviewError);
    //     dispatch(clearErrors())
    // }

    // if (success) {
    //     alert.success('Reivew posted successfully')
    //     dispatch({ type: NEW_REVIEW_RESET })
    // }
  }, [dispatch, alert, error, id]);

  // Ratings

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleAddQuantity = () => {
    if (quantity >= product.stock) {
      return;
    }

    setQuantity(quantity + 1);
  };

  const handleMinusQuantity = () => {
    if (quantity <= 1) {
      return;
    }

    setQuantity(quantity - 1);
  };

  // Ratings

  const [rating, setRating] = useState(product.ratings || 0);
  const [hover, setHover] = useState(0);

  const handleClick = (newRating) => {
    setRating(newRating);
  };

  const handleMouseOver = (newHover) => {
    setHover(newHover);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const handleCart = () => {
    dispatch(addItemToCart(id, quantity));
    alert.success("Item Added to Cart");
  };

  return (
    <div className="flex h-screen mt-12">
      <div className="w-1/2 flex justify-center items-start bg-red p-6">
        {product.images &&
          product.images.map((img, index) => (
            <img
              className="w-72"
              key={index}
              src={img.url}
              alt={product.title}
            />
          ))}
      </div>
      <div className="w-1/2  flex-col text-left p-6 ">
        <h2 className="font-bold text-lg">{product.name}</h2>

        {/* Ratings */}

        <div className="flex  items-center mr-auto pb-3">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <FaStar
                key={ratingValue}
                color={
                  ratingValue <= (hover || rating) ? "#ffc107 " : "#e4e5e9"
                }
                size={20}
                onClick={() => handleClick(ratingValue)}
                onMouseOver={() => handleMouseOver(ratingValue)}
                onMouseLeave={() => handleMouseLeave()}
              />
            );
          })}

          {/* <p className='mx-3'>{rating} out of 5 stars</p> */}
          <p className="pl-3">Reviews({product.numOfReviews})</p>
        </div>
        <p className="w-5/6 py-3">{product.description}</p>
        {/* Availability */}
        <div className="flex my-3">
          <h3 className="font-bold mr-2">Available:</h3>
          <span
            className={
              product.stock > 0 ? "font-bold text-[#0db313]" : "text-[#770505]"
            }
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Quantity */}
        <label htmlFor="quantity">Quantity:</label>
        <div className="flex items-center space-x-4 mb-6 w-48 p-3 my-3 rounded-sm  border border-[#171717]">
          <button className="px-3 py-1 " onClick={handleMinusQuantity}>
            -
          </button>
          <input
            className="w-16 text-center bg-transparent outline-none appearance-none"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "textfield",
              appearance: "textfield",
            }}
          />
          <button className="px-3 py-1 " onClick={handleAddQuantity}>
            +
          </button>
        </div>
        <button
          className="bg-[#000] w-48 p-6 text-[#fff] hover:bg-[#222222]"
          onClick={handleCart}
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
        <Link
          to="/payment"
          className="bg-[#953030] w-48 py-6 px-16 ml-3 text-[#ffffff] hover:bg-[#d26262]"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
