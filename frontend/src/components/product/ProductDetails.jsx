import React, { Fragment, useState, useEffect } from "react";
import { Radio } from "@material-tailwind/react";
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
import { addToWishlist, getWishlist } from "../../actions/wishlistAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ADD_TO_WISHLIST_RESET } from "../../constants/wishlistConstant";

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
  const { cartItems } = useSelector((state) => state.cart);

  const { error: reviewError, success: reviewSuccess } = useSelector(
    (state) => state.newReview
  );

  const isProductInCart = cartItems.some(
    (item) => String(item.product) === String(id)
  );

  const [selectedStickerSize, setSelectedStickerSize] = useState("2x2");
  const [selectedStickerPosition, setSelectedStickerPosition] =
    useState("top-left");

  console.log("selectedStickerSize", selectedStickerSize);
  console.log("selectedStickerPosition", selectedStickerPosition);

  const handleStickerSizeChange = (size) => {
    setSelectedStickerSize(size);
  };

  const handleStickerPositionChange = (position) => {
    setSelectedStickerPosition(position);
  };

  const { success: wishlistSuccess } = useSelector(
    (state) => state.newWishlist
  );

  const addWishlistHandler = () => {
    dispatch(addToWishlist(id));
  };

  useEffect(() => {
    dispatch(getProductDetails(id));

    if (error) {
      toast.error(error);
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (reviewSuccess) {
      toast.success("Review posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getWishlist());

    if (wishlistSuccess) {
      console.log("A");
      toast.success("Added to wishlist successfully");
      dispatch({ type: ADD_TO_WISHLIST_RESET });
    }
  }, [
    dispatch,
    toast,
    error,
    reviewError,
    id,
    reviewSuccess,
    wishlistSuccess,
    cartItems,
  ]);
  // Add the following code to reset wishlistSuccess
  // useEffect(() => {
  //   if (wishlistSuccess) {
  //     console.log("Wishlist success changed"); // Add this line
  //     alert.success("Added to wishlist successfully");
  //     dispatch({ type: ADD_TO_WISHLIST_RESET });
  //   }
  // }, [wishlistSuccess, dispatch, alert]);

  //Review

  const handleModal = () => {
    setModal(!modal);
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  console.log("a", product.quantity);

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
    toast.success("Item Added to Cart");
  };

  const handleAddStickerToCart = (
    id,
    quantity,
    stickerSize,
    stickerPosition
  ) => {
    dispatch(addItemToCart(id, quantity, stickerSize, stickerPosition));
  };

  const reviewHandler = () => {
    const formData = new FormData();

    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);

    dispatch(newReview(formData));
  };

  return (
    <div className="bg-[#121212] pt-28 min-h-screen text-white">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row lg:mx-12  gap-6 ">
        <div className="flex lg:w-1/2 ">
          <div className="flex flex-row-reverse   bg-[#f00f]  justify-end w-full ">
            {/* Right side image */}
            <div className="w-full mx-auto bg-[#1E1E1E]">
              {product.images && product.images.length > 0 && (
                <img
                  className="mx-auto w-96 h-full object-contain  "
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

        <div className="lg:w-1/2 text-left px-6 space-y-3">
          <h2 className="font-bold text-lg">{product.name}</h2>

          {/* Ratings */}

          <div className="flex  items-center mr-auto ">
            <Rating value={productRating} readonly />

            <p className="pl-3">Reviews({product.numOfReviews})</p>
          </div>
          <p className="lg:w-5/6 text-[#dbdbdb]">{product.description}</p>
          {/* Availability */}
          <div className="flex ">
            <h3 className=" mr-2">Available:</h3>
            <span
              className={
                product.stock > 0 ? "text-[#0db313]" : "text-[#770505]"
              }
            >
              {product.stock > 0 ? "In Stock " : "Out of Stock "}
            </span>
            ({product.stock})
          </div>

          {/* Quantity */}
          <label htmlFor="quantity">Quantity:</label>
          <div className="flex items-center space-x-4 w-48 p-3 rounded-sm  border border-[#cdcdcd]">
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
          {/* Sticker */}
          {product.category === "655dfb180fcf137bcb9e7586" && (
            <div key={product.productId} className="grid  ">
              {/* ...other product details */}
              <div className="flex py-3  ">
                {/* Display sticker size options */}
                <div className="text-white">
                  <h4 className="px-3">Size</h4>

                  <div className="flex py-3 text-white hover:text-[#e6e355]  ">
                    <Radio
                      name="sticker-size"
                      label="2x2"
                      color="blue"
                      checked={selectedStickerSize === "2x2"}
                      onChange={() => handleStickerSizeChange("2x2")}
                    />
                    <Radio
                      name="sticker-size"
                      label="4x4"
                      color="blue"
                      checked={selectedStickerSize === "4x4"}
                      onChange={() => handleStickerSizeChange("4x4")}
                    />
                    <Radio
                      name="sticker-size"
                      label="8x8"
                      color="blue"
                      checked={selectedStickerSize === "8x8"}
                      onChange={() => handleStickerSizeChange("8x8")}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="px-3">Position</h4>
                <div className="flex  flex-wrap  col-span-3 items-center justify-start gap-3">
                  {/* <Radio name="type" label="top-left" defaultChecked /> */}
                  <Radio
                    name="sticker-position"
                    label="top-left"
                    color="blue"
                    checked={selectedStickerPosition === "top-left"}
                    onChange={() => handleStickerPositionChange("top-left")}
                  />
                  <Radio
                    name="sticker-position"
                    label="top-right"
                    color="blue"
                    checked={selectedStickerPosition === "top-right"}
                    onChange={() => handleStickerPositionChange("top-right")}
                  />
                  <Radio
                    name="sticker-position"
                    label="center"
                    color="blue"
                    checked={selectedStickerPosition === "center"}
                    onChange={() => handleStickerPositionChange("center")}
                  />
                  <Radio
                    name="sticker-position"
                    label="bottom-left"
                    color="blue"
                    checked={selectedStickerPosition === "bottom-left"}
                    onChange={() => handleStickerPositionChange("bottom-left")}
                  />
                  <Radio
                    name="sticker-position"
                    label="bottom-right"
                    color="blue"
                    checked={selectedStickerPosition === "bottom-right"}
                    onChange={() => handleStickerPositionChange("bottom-right")}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Add to cart */}
          <div className="flex items-center space-x-6">
            {product.category !== "655dfb180fcf137bcb9e7586" ? (
              <button
                className="bg-[#4F46E5] hover:bg-[#4540a6] w-72 text-white rounded py-3 px-6 my-6 cursor-pointer"
                onClick={handleCart}
                disabled={product.stock === 0 || isProductInCart} // Disable if out of stock or in cart
              >
                {isProductInCart
                  ? "Product is already in the cart"
                  : "Add to Cart"}
              </button>
            ) : (
              <button
                className="bg-[#4F46E5] hover:bg-[#4540a6] w-full text-white rounded py-3 px-6  cursor-pointer"
                onClick={() =>
                  handleAddStickerToCart(
                    id,
                    quantity,
                    selectedStickerSize,
                    selectedStickerPosition
                  )
                }
              >
                {/* Re-enable isProductInCart */}
                {isProductInCart
                  ? "Product is already in the cart"
                  : "Sticker Add to Cart"}
              </button>
            )}
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
                            className="w-full mx-6 border-1 text-black h-48 bg-[#ffffff73] "
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
      <div>
        <RelatedProducts productId={id} />

        {product.reviews && product.reviews.length > 0 && (
          <ListReviews reviews={product.reviews} />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
