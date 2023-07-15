import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Pagination from "react-js-pagination";
const Customization = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [openProduct, setOpenProduct] = useState(true);

  console.log(products);

  return (
    <>
      <div className="flex container mx-auto px-6 mt-12  h-screen">
        <div className="bg-[#ca9d9d] w-8/12">
          <div className="flex items-center justify-center h-full">
            <h4>Choose to DESIGN</h4>
          </div>
        </div>
        <div className="bg-[#b9b5b5] w-4/12">
          <>
            <div
              className="bg-[#000] py-6 rounded-t-lg cursor-pointer"
              onClick={() => setOpenProduct(!openProduct)}
            >
              <h4 className="text-white pl-8">Choose to DESIGN</h4>
            </div>

            {openProduct ? (
              <div className="p-6 mx-6 overflow-x-auto ">
                <div className="flex space-x-3 scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter((category) => category.category === "Tanks")
                    .map((product) => (
                      <img
                        key={product._id}
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-32 h-32"
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
              onClick={() => setOpenProduct(!openProduct)}
            >
              <h4 className="text-white pl-8">SEcond to DESIGN</h4>
            </div>
            {openProduct ? (
              <div className="p-6 mx-6 overflow-x-auto ">
                <div className="flex space-x-3 scrollbar-thin scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-700">
                  {products
                    .filter((category) => category.category === "Tanks")
                    .map((product) => (
                      <img
                        key={product._id}
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-32 h-32"
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
