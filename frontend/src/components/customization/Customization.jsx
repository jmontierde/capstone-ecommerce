import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Pagination from "react-js-pagination";

const Customization = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [openTanks, setopenTanks] = useState(true);
  const [openMods, setOpenMods] = useState(true);
  const [selectedTanks, setselectedTanks] = useState(null); // State to track the selected image URL
  const [selectedMods, setselectedMods] = useState(null);
  const navigate = useNavigate(); // Hook to enable navigation

  console.log(products);

  // Function to handle the click on a product image in the second container
  const handleImageTanks = (tanksUrl) => {
    setselectedTanks(tanksUrl);
  };

  const handleImageMods = (modsUrl) => {
    setselectedMods(modsUrl);
  };

  return (
    <>
      <div className="flex container mx-auto px-6 mt-12 h-screen">
        <div className="bg-[#ca9d9d] w-8/12 flex flex-col items-center justify-center relative">
          <div>
            {selectedTanks ? (
              <div className="flex items-center justify-center absolute top-0">
                <img
                  src={selectedTanks}
                  alt="Selected Image"
                  className="w-72  "
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
                  className="w-72 h-72 "
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h4>Choose to DESIGN</h4>
              </div>
            )}
          </div>
          <button className="bg-[#49ae78] px-8 py-3 rounded text-white">
            View 3d
          </button>
        </div>
        <div className="bg-[#b9b5b5] w-4/12">
          <>
            <div
              className="bg-[#000] py-6 rounded-t-lg cursor-pointer"
              onClick={() => setopenTanks(!openTanks)}
            >
              <h4 className="text-white pl-8">Choose Tanks</h4>
            </div>

            {openTanks ? (
              <div className="p-6 mx-6 overflow-x-auto ">
                <div className="flex space-x-3 scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter((category) => category.category === "Tanks")
                    .map((product) => (
                      <img
                        key={product._id}
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-32 h-32 cursor-pointer" // Add cursor-pointer class to make it clear it's clickable
                        onClick={() => handleImageTanks(product.images[0].url)} // Call the handleProductClick function on click
                      />
                    ))}
                </div>
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
              <div className="p-6 mx-6 overflow-x-auto ">
                <div className="flex space-x-3 scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter((category) => category.category === "Mods")
                    .map((product) => (
                      <img
                        key={product._id}
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-32 h-32 cursor-pointer" // Add cursor-pointer class to make it clear it's clickable
                        onClick={() => handleImageMods(product.images[0].url)} // Call the handleProductClick function on click
                      />
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
