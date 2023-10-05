import React, { Fragment, useState, useEffect } from "react";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
// import ListReviews from '../review/ListReviews'
import { FaHtml5, FaStar } from "react-icons/fa";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productActions";
import { useParams } from "react-router-dom";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { addItemToCart, getCheckout } from "../../actions/cartActions";
import ListReviews from "../review/ListReviews";
import { useNavigate } from "react-router-dom";
import RelatedProducts from "./RelatedProduct";
import { Rating } from "@material-tailwind/react";
import { addToWishlist } from "../../actions/wishlistAction";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { reviewError, success } = useSelector((state) => state.newReview);

  const addWishlistHandler = () => {
    console.log("WISHLIST");
    dispatch(addToWishlist(id));
  };

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (error) {
      alert.error(error);
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Reivew posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, error, reviewError, id, success]);

  //Review

  const handleModal = () => {
    setModal(!modal);
  };

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

  const handleCart = () => {
    dispatch(addItemToCart(id, quantity));
    alert.success("Item Added to Cart");
  };

  const handleCheckout = () => {
    dispatch(getCheckout(id, quantity));
  };

  const reviewHandler = () => {
    const formData = new FormData();

    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);

    dispatch(newReview(formData));
  };

  return (
    <>
      <div className="flex container mx-auto mt-12 gap-6">
        <div className="flex w-1/2 h-full bg-[#000]">
          <div className="flex flex-row-reverse  justify-end w-full">
            {/* Right side image */}
            <div className="w-full bg-[#FAFAFA]">
              {product.images && product.images.length > 0 && (
                <img
                  className="mx-auto h-96"
                  src={product.images[0].url}
                  alt={product.title}
                />
              )}
            </div>

            {/* Left side images */}
            <div className="flex flex-col items-start gap-6 ">
              {product.images &&
                product.images
                  .slice(1)
                  .map((img, index) => (
                    <img
                      className="w-36"
                      key={index}
                      src={img.url}
                      alt={product.title}
                    />
                  ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 text-left px-6 space-y-3">
          <h2 className="font-bold text-lg">{product.name}</h2>

          {/* Ratings */}

          <div className="flex  items-center mr-auto ">
            <Rating value={productRating} readonly />

            <p className="pl-3">Reviews({product.numOfReviews})</p>
          </div>
          <p className="w-5/6 ">{product.description}</p>
          {/* Availability */}
          <div className="flex ">
            <h3 className="font-bold mr-2">Available:</h3>
            <span
              className={
                product.stock > 0
                  ? "font-bold text-[#0db313]"
                  : "text-[#770505]"
              }
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.stock}
          </div>

          {/* Quantity */}
          <label htmlFor="quantity">Quantity:</label>
          <div className="flex items-center space-x-4 w-48 p-3 rounded-sm  border border-[#171717]">
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
          <div className="flex items-center space-x-6">
            <button
              // className="bg-[#000] w-48 p-6 text-[#fff] hover:bg-[#222222]"
              className="bg-[#4F46E5] hover:bg-[#4540a6] w-72 text-white rounded py-3 px-6 my-6 cursor-pointer"
              onClick={handleCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="gray"
              className="w-10 h-10 hover:bg-[#FAFAFA] cursor-pointer p-1"
              onClick={addWishlistHandler}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          {/* Review */}
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
        </div>
      </div>
      <>
        <RelatedProducts productId={id} />

        {product.reviews && product.reviews.length > 0 && (
          <ListReviews reviews={product.reviews} />
        )}
      </>
    </>
  );
};

export default ProductDetails;
