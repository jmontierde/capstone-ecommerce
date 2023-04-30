import React from 'react'
import {BsSearch} from 'react-icons/bs';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
const Search = () => {

  const [searchHide, setSearchHide] = useState(true);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();



  function handleSearchHide(e) { 
    if(keyword !== null){ 
      console.log("hi")
    }else{ 
      console.log("Hello");
    }
  }


  function handleInputChange(e){
    const keyword = e.target.value.trim();
    setKeyword(keyword);
    if (keyword === '') {
      navigate('');
    } else {
      navigate(`search/${keyword}`);
    }
  }
    


  return (
    <div className='flex text-[#525151] space-x-6 space-y-auto  '>
        {searchHide && 
            <input type="text" name="searchProduct" value={keyword} onChange={handleInputChange}
            placeholder='Search' id="searchProduct" 
            className="  placeholder:text-slate-400  text-[#000] bg-white  border  border-slate-300 
            rounded-md  pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
            focus:ring-1 "/>
        }

        <BsSearch 
        className='m-auto text-2xl'
        onClick={handleSearchHide}
        />

        
  
    </div>
  )
}

export default Search