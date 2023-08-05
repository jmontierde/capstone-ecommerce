import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../actions/productActions";
import Product from "./product/Product";
import MetaData from "./layout/MetaData";
import Pagination from "react-js-pagination";

import Loader from "./layout/Loader";
// import { useAlert } from 'react-alert'

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

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rating, setRating] = useState(0);

  // const categoriess = [
  //   "Atomizers",
  //   "Mods",
  //   "Coils",
  //   "Tanks",
  //   "Batteries",
  //   "Relx",
  //   "Skin",
  //   "Accessories",
  //   "Disposable Vapes",
  // ];

  const { keyword } = useParams();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(
      getProducts(keyword, currentPage, sortOption, selectedCategories, rating)
    );
  }, [dispatch, keyword, currentPage, sortOption, selectedCategories, rating]);

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

  return (
    <Fragment>
      <MetaData title={"Sir Jacks"} />

      <div className="flex container py-6 mx-auto">
        <div className="w-1/5 flex flex-col container mr-auto h-full  ">
          <div>
            <h3 className="font-bold">Filter by Category:</h3>
            <ul>
              {categories.map((category) => (
                <li key={category} className="pt-3">
                  <input
                    type="checkbox"
                    id={category.name}
                    name={category.name}
                    checked={selectedCategories.includes(category.name).name}
                    onChange={() => handleCategoryFilterChange(category.name)}
                  />
                  <label htmlFor={category.name} className="pl-2">
                    {category.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-4/5">
          <h2 className="text-4xl ">Products</h2>
          <div className="ml-auto m-6 w-64">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-3 border border-[#000]"
            >
              <option value="">Sort By</option>
              <option value="new-arrival">New Arrival</option>
              <option value="asc-price">Price: Low to High</option>
              <option value="desc-price">Price: High to Low</option>
              <option value="asc-title">Name: A-Z</option>
              <option value="desc-title">Name: Z-A</option>
            </select>
          </div>

          <div className="grid grid-cols-auto md:grid-cols-4 gap-6 text-center h-screen">
            {products &&
              products.map((product) => (
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
                itemClass="page-item border border-gray-300 mr-1 w-20 py-6 flex justify-center items-center cursor-pointer hover:bg-gray-300"
                linkClass="page-link"
                innerClass="flex items-center"
                activeClass="bg-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
