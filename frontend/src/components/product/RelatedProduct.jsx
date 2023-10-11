import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedProducts } from "../../actions/productActions";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // Import the FaStar component for star icons

const RelatedProducts = ({ productId }) => {
  const dispatch = useDispatch();

  const { relatedProducts, loading, error } = useSelector(
    (state) => state.relatedProducts
  );

  useEffect(() => {
    // Fetch related products when the component mounts
    dispatch(getRelatedProducts(productId));
  }, [dispatch, productId]);

  // Function to generate star icons based on the rating value
  const renderStarRating = (rating) => {
    const stars = [];
    const maxRating = 5; // Assuming a maximum rating of 5 stars

    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#ffc107" size={24} />);
      } else {
        stars.push(<FaStar key={i} color="#e4e5e9" size={24} />);
      }
    }

    return stars;
  };

  // Conditionally render the component based on whether there are related products or not
  if (!relatedProducts.length) {
    return null; // Return null if there are no related products
  }

  return (
    <div className="container mx-auto  related-products-container">
      <h2 className="text-left">Related Products</h2>

      <div className="flex items-center justify-center gap-6 mt-6 mb-12 ">
        {relatedProducts.map((product) => (
          <div key={product._id} className=" w-full text-center ">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-48 h-48 mx-auto"
              />
              <h3>{product.name}</h3>
              <p>₱{product.price}</p>
              <div className="flex justify-center items-center">
                {renderStarRating(product.ratings)}
              </div>
              {/* Add other product details you want to display */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
