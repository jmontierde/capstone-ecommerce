import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../actions/productActions";
import Product from "./product/Product";
import MetaData from "./layout/MetaData";
import Pagination from "react-js-pagination";
import { useMediaQuery } from "@react-hook/media-query";
import Loader from "./layout/Loader";

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
  const isMediumScreen = useMediaQuery("(min-width: 1024px");

  const isSmScreen = useMediaQuery({ maxWidth: 480 });
  const isMdScreen = useMediaQuery({ maxWidth: 768 });
  const isLgScreen = useMediaQuery({ maxWidth: 976 });
  const isXlScreen = useMediaQuery({ maxWidth: 1440 });

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

  console.log("categorySize", selectedCategories);

  return (
    <>
      <MetaData title={"Vapers Sidewalk"} />
      <div className="flex flex-col lg:flex-row container py-6 mx-auto mt-20">
        <div className="w-1/5 flex flex-col container mr-auto h-full">
          <div>
            {isLargeScreen && (
              <div>
                <h3 className="font-bold">Filter by Category:</h3>
                {/* Step 3: Conditionally render the categories based on the state variable. */}
                {showCategories && (
                  <ul>
                    {categories.map(
                      (category) => (
                        console.log("A", category._id),
                        (
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
                              className="pl-2 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </li>
                        )
                      )
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-4/5  md:w-full ">
          <div className=" flex justify-between items-start px-12">
            <div
              className="cursor-pointer my-auto relative w-full"
              onClick={() => setCategorySize(!categorySize)}
            >
              Category
              {categorySize ? (
                <div className="absolute  w-full">
                  {" "}
                  <ul>
                    {categories.map((category) => (
                      <li className="pt-3" key={category.name}>
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          id={category.name}
                          name={category.name}
                          checked={selectedCategories.includes(category.name)}
                          onChange={() =>
                            handleCategoryFilterChange(category.name)
                          }
                        />
                        <label
                          htmlFor={category.name}
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
            <div className="flex items-start justify-start w-auto">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="py-3 lg:p-3 border   w-auto text-sm lg:text-normal"
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

          <div className="mt-6 grid  sm:grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 xl:gap-x-8 ">
            {products &&
              products.map((product, index) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
          {resPerPage <= count && (
            <div className="flex justify-center mt-6">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={filteredProductsCount}
                onChange={(pageNumber) => setCurrentPage(pageNumber)}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item border border-gray-300 mr-1 w-20 py-6 flex justify-center items-center cursor-pointer hover-bg-gray-300"
                linkClass="page-link"
                innerClass="flex items-center"
                activeClass="bg-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
