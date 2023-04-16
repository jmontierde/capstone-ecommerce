import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    const value = event.target.value;
    setKeyword(value);

    if (value.trim()) {
      navigate(`/search/${value}`);
      console.log("Searching for:", value);
    } else {
      navigate('/product');
    }
  }

  return (
    <form className='flex'>
      <input
        type="text"
        id="searchProduct"
        value={keyword}
        onChange={handleSearch}
        placeholder='Search'
        className="placeholder:text-slate-400  text-[#000] bg-white mr-3  border  border-slate-300 
        rounded-md  pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
        focus:ring-1 "
      />
      <BsSearch
        className='m-auto text-2xl'
      />
    </form>
  )
}

export default Search;
