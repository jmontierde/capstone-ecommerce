import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../actions/wishlistAction";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REMOVE_FROM_WISHLIST_RESET } from "../../constants/wishlistConstant";
import { clearErrors } from "../../actions/wishlistAction";
const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, error, loading } = useSelector(
    (state) => state.getWishlist
  );
  const { isDeleted } = useSelector((state) => state.deleteWishlist);

  console.log("ERROR", error);

  useEffect(() => {
    dispatch(getWishlist());

    if (error) {
      toast.error(error);
      // dispatch(clearErrors());
    }

    // if (!wishlist) {
    //   navigate("/wishlist");

    //   return;
    // }

    if (isDeleted) {
      toast.success("Wishlist deleted successfully");
      navigate("/wishlist");
      dispatch({ type: REMOVE_FROM_WISHLIST_RESET });
    }
  }, [dispatch, isDeleted, error]);

  return (
    <div className="container mx-auto space-y-6 mt-24">
      <ToastContainer />
      <h1 className="mt-12 text-2xl font-bold ">My Wishlist</h1>
      <div className="grid grid-cols-auto md:grid-cols-4 gap-6 text-center">
        {wishlist && wishlist.products && wishlist.products.length > 0 ? (
          wishlist.products.map((product) => (
            <div
              key={product._id}
              className="bg-[#E7E8EA] hover:opacity-80 p-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 ml-auto cursor-pointer"
                onClick={() => dispatch(removeFromWishlist(product._id))}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <Link to={`/product/${product._id}`}>
                {product.images && product.images.length > 0 && (
                  <img
                    className="mx-auto w-48 h-48"
                    src={product.images[0].url}
                    alt={product.title}
                  />
                )}
                <h5>{product.name}</h5>
                <p>₱{product.price}</p>
              </Link>
              {/* Add other details as needed */}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <p>Your wishlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
