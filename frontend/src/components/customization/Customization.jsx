import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Pagination from "react-js-pagination";
import { Button } from "@material-tailwind/react";
import { addItemToCart, getCheckout } from "../../actions/cartActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Customization = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);

  const [openTanks, setopenTanks] = useState(true);
  const [openMods, setOpenMods] = useState(true);
  const [selectedTanks, setselectedTanks] = useState(null);
  const [selectedTanksId, setselectedTanksId] = useState(null);
  const [selectedModsId, setselectedModsId] = useState(null);

  const [selectedMods, setselectedMods] = useState(null);
  const navigate = useNavigate(); // Hook to enable navigation

  const [productQuantities, setProductQuantities] = useState({});

  // Function to handle quantity change for a specific product
  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value);
    setProductQuantities({
      ...productQuantities,
      [productId]: newQuantity,
    });
  };

  const handleAddQuantity = (productId) => {
    const newQuantity = (productQuantities[productId] || 0) + 1;
    setProductQuantities({
      ...productQuantities,
      [productId]: newQuantity,
    });
  };

  const handleMinusQuantity = (productId) => {
    if (productQuantities[productId] > 1) {
      const newQuantity = productQuantities[productId] - 1;
      setProductQuantities({
        ...productQuantities,
        [productId]: newQuantity,
      });
    }
  };

  const isProductInCart = cartItems.some(
    (item) => item.product === selectedTanksId
  );

  const handleAddToCart = (productId, quantity) => {
    const isProductInCart = cartItems.some(
      (item) => item.product === productId
    );

    if (!isProductInCart) {
      dispatch(addItemToCart(productId, quantity));
      toast.success("Item Added to Cart");
    } else {
      toast.error("Product is already in the cart");
    }
  };

  // Function to handle the click on a product image in the second container
  const handleImageTanks = (tanksUrl) => {
    console.log("tanksUrl", tanksUrl.productId);
    setselectedTanks(tanksUrl.images[0].url);
    setselectedTanksId(tanksUrl.productId);
  };

  const handleImageMods = (modsUrl) => {
    setselectedMods(modsUrl);
  };

  console.log("productQuantities", productQuantities);

  return (
    <>
      <div className="flex  mt-16 min-h-screen">
        <div className="w-8/12 flex flex-col items-center justify-center relative">
          <div>
            {selectedTanks ? (
              <div className="flex items-center justify-center absolute top-28 mt-1 ml-16 ">
                <img
                  src={selectedTanks}
                  alt="Selected Image"
                  className="w-44 z-30"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center ">
                <h4>Choose to DESIGN</h4>
              </div>
            )}
            {selectedMods ? (
              <div className="flex items-center justify-center  ">
                <img
                  src={selectedMods}
                  alt="Selected Image"
                  className="w-72 h-72 z-50"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h4>Choose to DESIGN</h4>
              </div>
            )}
          </div>
          {/* <button className="bg-[#49ae78] px-8 py-3 rounded text-white">
            View 3d
          </button> */}
        </div>
        <div className=" border-x-black  border w-4/12">
          <>
            <div
              className="bg-[#000] py-6 rounded-t-lg cursor-pointer"
              onClick={() => setopenTanks(!openTanks)}
            >
              <h4 className="text-white pl-8">Choose Tanks</h4>
            </div>

            {openTanks ? (
              <div className="p-3  overflow-x-auto ">
                <div className="flex  space-x-1  scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter(
                      (category) =>
                        category.category === "64cc6846182d28d94bdfc281"
                    )
                    .map((product) => (
                      <div className=" text-center hover:text-[#e6e355]">
                        <img
                          key={product.productId}
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-32 h-32 cursor-pointer" // Add cursor-pointer class to make it clear it's clickable
                          onClick={() => handleImageTanks(product)} // Call the handleProductClick function on click
                        />
                        <p className="text-xs">
                          <span className="font-semibold">{product.name}</span>{" "}
                          <br />₱{product.price}
                        </p>
                        <div
                          className=" text-center hover:text-[#e6e355]"
                          // key={product.productId}
                        >
                          {/* ... (existing code remains the same) */}
                          <button
                            className="px-3 py-1"
                            onClick={() =>
                              handleMinusQuantity(product.productId)
                            }
                          >
                            -
                          </button>
                          <input
                            className="w-16 text-center bg-transparent outline-none appearance-none"
                            type="number"
                            value={productQuantities[product.productId] || 1}
                            onChange={(event) =>
                              handleQuantityChange(product.productId, event)
                            }
                            min="1"
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                              appearance: "textfield",
                            }}
                          />
                          <button
                            className="px-3 py-1"
                            onClick={() => handleAddQuantity(product.productId)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  className="bg-[#4F46E5] hover:bg-[#4540a6] w-full text-white rounded py-3 px-6 my-6 cursor-pointer"
                  onClick={() =>
                    handleAddToCart(
                      selectedTanksId,
                      productQuantities[selectedTanksId]
                    )
                  }
                >
                  {isProductInCart
                    ? "Product is already in the cart"
                    : "Add to Cart"}
                </button>
              </div>
            ) : (
              <p></p>
            )}
          </>
          <>
            <div
              className="bg-[#000] py-6 rounded-t-lg cursor-pointer"
              onClick={() => setOpenMods(!openMods)}
            >
              <h4 className="text-white pl-8">Choose Mods</h4>
            </div>
            {openMods ? (
              <div className="py-6 overflow-x-auto ">
                <div className="flex space-x-3 scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter(
                      (category) =>
                        category.category === "64cc682e182d28d94bdfc27b"
                    )
                    .map((product) => (
                      <div className=" text-center hover:text-[#e6e355]">
                        <img
                          key={product.productId}
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-32 h-32 cursor-pointer" // Add cursor-pointer class to make it clear it's clickable
                          onClick={() => handleImageMods(product.images[0].url)} // Call the handleProductClick function on click
                        />
                        <p className="text-xs">
                          <span className="font-semibold">{product.name}</span>{" "}
                          <br />₱{product.price}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p></p>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Customization;
