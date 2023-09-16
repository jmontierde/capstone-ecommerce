import React from "react";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
const Search = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearchHide(e) {
    if (keyword.trim() === "") {
      setIsSearch((prevHide) => !prevHide);
    } else {
      setIsSearch(true);
    }
  }

  function handleInputChange(e) {
    const keyword = e.target.value.trim();
    setKeyword(keyword);
    if (keyword === "") {
      navigate("/product");
    } else {
      navigate(`search/${keyword}`);
    }
  }

  return (
    <div className="flex text-[#525151] space-x-6 ">
      {isSearch && (
        <input
          type="text"
          name="searchProduct"
          value={keyword}
          onChange={handleInputChange}
          placeholder="Search"
          id="searchProduct"
          className="  placeholder:text-slate-400  text-[#000] bg-white  border  border-slate-300 
            rounded-md py-0.5 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
            focus:ring-1 pl-3  sm:w-5/6 md:pl-9 md:py-1"
        />
      )}

      <BsSearch className="m-auto w-5 md:text-2xl" onClick={handleSearchHide} />
    </div>
  );
};

export default Search;
