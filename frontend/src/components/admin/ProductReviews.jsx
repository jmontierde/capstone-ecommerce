import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductReviews,
  deleteReview,
  clearErrors,
} from "../../actions/productActions";

import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, reviews } = useSelector((state) => state.productReviews);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (productId !== "") {
      dispatch(getProductReviews(productId));
    }

    if (isDeleted) {
      alert.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, error, productId, isDeleted, deleteError]);

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, productId));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getProductReviews(productId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">Reviews</h1>
      <div className="flex justify-center items-center mt-5">
        <div className="col-5">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="productId_field">Enter Product ID</label>
              <input
                type="text"
                id="productId_field"
                className="border border-[#000]"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="bg-[#2e69a8] rounded py-2 my-3 text-white px-8"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      <div className="flex container mx-auto px-12">
        <div className="flex w-10/12 justify-center ">
          <table className="table-fixed w-full h-32">
            <thead className="bg-[#ECEFF1]">
              <tr>
                <th className="px-4 py-2">Review ID</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Comment</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id}>
                    <td className="border px-4 py-3">{review._id}</td>
                    <td className="border px-4 py-3">{review.rating}</td>
                    <td className="border px-4 py-3">{review.comment}</td>
                    <td className="border px-4 py-3">{review.name}</td>
                    <td className="border px-4 py-3">
                      <div className="flex justify-center items-center space-x-3">
                        <img
                          src="/images/deleteHover.png"
                          alt="View product"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => deleteReviewHandler(review._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No reviews found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
