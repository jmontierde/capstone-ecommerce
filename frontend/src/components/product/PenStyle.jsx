import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import HeaderCategory from "./HeaderCategory";

const PenStyle = () => {
  const dispatch = useDispatch();
  const {
    loading,
    products,
    error,
    // productsCount,
    // resPerPage,
    // filteredProductsCount,
  } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  console.log("PRODUCTS", products);

  return (
    <div className=" mx-auto text-white bg-[#000000] mt-16">
      <img
        src="./product-image/pen-style-model.jpg"
        alt="pod-model"
        className="w-screen h-96 object-cover"
      />
      <HeaderCategory />
      <div className="bg-[#000] p-6 space-y-6">
        <h2 className="text-center font-semibold my-12 text-3xl">
          Find the best Pods for you
        </h2>
        <div className=" grid md:grid-cols-2 lg:grid-cols-4 items-center justify-center lg:w-2/3 mx-auto   gap-6 ">
          {products
            .filter((prod) => prod.category === "653cbe835c09dc4ba0134fc7")
            .map((product) => (
              <div className=" space-y-3">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-96 h-fit py-8 px-6 mx-auto rounded-lg bg-[#F8F8F8]"
                  />
                )}
                <p>{product.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PenStyle;
