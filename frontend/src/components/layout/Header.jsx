import React, { Fragment, useState, useRef } from 'react'
import {BsPerson, BsSearch, BsCart3, BsInfoSquareFill} from 'react-icons/bs';
const Header = () => {

  const [searchHide, setSearchHide] = useState(true);



  const searchInputRef = useRef(null);
 

  function handleSearch() { 
    if (searchHide && searchInputRef.current.value !== '') {
      // perform search with searchInputRef.current.value
      // For Search Products
      console.log(searchInputRef.current.value);
    }
    else{
      setSearchHide(!searchHide)
    }

  }

  console.log(searchHide)

  return (
    <Fragment>
        <nav className='flex container py-6 px-12 m-auto justify-between font-custom cursor-pointer'>
          <ul className='flex  space-x-6 space-y-auto uppercase fo'>
            <h2 className='mr-16 font-bold text-2xl normal-case'>AgileAvenue</h2>
            <a href="">Home</a>
            <a href="">Product</a>
            <a href="">Service</a>
            <a href="">Company</a>
            <a href="">News</a>
            <a href="">Contact</a>
    
          </ul>
          <div className='flex text-[#525151] space-x-6 space-y-auto  '>
            {searchHide && 
              <input type="text" name="searchProduct" ref={searchInputRef}
              placeholder='Search' id="searchProduct" 
              className="  placeholder:text-slate-400  text-[#000] bg-white  border  border-slate-300 
              rounded-md  pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 
              focus:ring-1 "/>
            }

            <BsSearch 
            className='m-auto text-2xl'
            onClick={handleSearch}
            // onClick={() => setSearchHide(prevSearch => !prevSearch)}
            />

            
            <BsCart3 className='m-auto text-2xl'/>
            <BsPerson className='m-auto text-2xl'/>
          </div>
        </nav>
    </Fragment>
  )
}

export default Header