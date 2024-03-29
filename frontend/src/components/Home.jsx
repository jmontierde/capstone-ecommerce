import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../actions/productActions";
import Product from "./product/Product";
import MetaData from "./layout/MetaData";
import Pagination from "react-js-pagination";
// import { useMediaQuery } from "@react-hook/media-query";
import Loader from "./layout/Loader";
import { useMediaQuery } from "@uidotdev/usehooks";

const Home = () => {
  const dispatch = useDispatch();

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const { categories } = useSelector((state) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rating, setRating] = useState(0);
  const { keyword } = useParams();

  // Use the useMediaQuery hook to detect screen size
  const isLargeScreen = useMediaQuery("(min-width: 1024px");

  const isSmallDevice = useMediaQuery("only screen and (max-width : 1023px)");

  console.log("isSmallDevice", isSmallDevice);

  // Step 1: Add a state variable to track whether categories should be displayed.
  const [showCategories, setShowCategories] = useState(isLargeScreen);

  // Step 2: Add an event handler to toggle this state variable.

  useEffect(() => {
    dispatch(getCategories());
    dispatch(
      getProducts(keyword, currentPage, sortOption, selectedCategories, rating)
    );
  }, [dispatch, keyword, currentPage, sortOption, selectedCategories, rating]);

  // Function to toggle categories on medium screens (md) and below
  const toggleCategories = () => {
    if (!isLargeScreen) {
      setShowCategories(!showCategories);
    }
  };

  // Sort
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    dispatch(getProducts(keyword, 1, e.target.value));
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    setCurrentPage(1);
  };

  let count = productsCount;

  const [categorySize, setCategorySize] = useState(false);
  // 0c0c0c
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Vapers Sidewalk"} />
          <div className="flex flex-col lg:flex-row text-white py-12 lg:px-16 min-h-screen  mt-16  bg-[#121212]">
            <div className="w-1/5 flex flex-col container  mr-auto h-full">
              <div>
                {isLargeScreen && (
                  <div className="text-[#d3d3d3]">
                    <h3 className="font-bold">Filter by Category:</h3>
                    {/* Step 3: Conditionally render the categories based on the state variable. */}
                    {showCategories && (
                      <ul>
                        {categories.map((category) => (
                          <li className="pt-3" key={category._id}>
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              id={category._id}
                              name={category._id}
                              checked={selectedCategories.includes(
                                category._id
                              )}
                              onChange={() =>
                                handleCategoryFilterChange(category._id)
                              }
                            />
                            <label
                              htmlFor={category.name}
                              className="pl-2 cursor-pointer hover:text-[#e6e355]"
                            >
                              {category.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-4/5  md:w-full   text-[#d3d3d3] ">
              <div className=" flex  justify-between lg:justify-end  items-center px-6 lg:px-0">
                {isSmallDevice && (
                  <div
                    className="cursor-pointer my-auto   relative w-full "
                    onClick={() => setCategorySize(!categorySize)}
                  >
                    <h5 className="hover:text-[#e6e355] ">Category</h5>
                    {categorySize ? (
                      <div className="absolute ">
                        {" "}
                        <ul>
                          {categories.map((category) => (
                            <li className="pt-3" key={category._id}>
                              <input
                                type="checkbox"
                                className="cursor-pointer"
                                id={category._id}
                                name={category._id}
                                checked={selectedCategories.includes(
                                  category._id
                                )}
                                onChange={() =>
                                  handleCategoryFilterChange(category._id)
                                }
                              />
                              <label
                                htmlFor={category._id}
                                className="pl-2 cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                )}
                <div className="flex items-start justify-start   w-auto">
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="py-3 lg:p-3 border text-black  w-auto text-sm lg:text-normal"
                  >
                    <option value="">Sort By</option>
                    <option value="new-arrival">New Arrival</option>
                    <option value="asc-price">Price: Low to High</option>
                    <option value="desc-price">Price: High to Low</option>
                    <option value="asc-title">Name: A-Z</option>
                    <option value="desc-title">Name: Z-A</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid mx-6 lg:mx-0    gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 xl:gap-x-8 ">
                {products &&
                  products.map((product, index) => (
                    <Product key={product._id} product={product} />
                  ))}
              </div>
              {resPerPage <= count && (
                <div className="flex justify-center mt-12">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProductsCount}
                    onChange={(pageNumber) => setCurrentPage(pageNumber)}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    itemClass="page-item border border-[#fff] mr-1 w-20 py-6 flex justify-center items-center cursor-pointer hover:bg-[#1E1E1E]"
                    linkClass="page-link"
                    innerClass="flex items-center"
                    activeClass="bg-[#1E1E1E]"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
