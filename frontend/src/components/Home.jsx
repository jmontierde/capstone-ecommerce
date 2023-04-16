import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Product from './product/Product';
import { Fragment, useEffect } from 'react';
import MetaData from './layout/MetaData';
import Loader from './layout/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  // Pages
  const [currentPage, setCurrentPage] = useState(1);

  const alert = useAlert();
  const dispatch = useDispatch();

  

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  // console.log(filteredProductsCount)

//   const navigate = useNavigate();
//   const handleProductClick = (productId) => {
//     navigate(`http://localhost:7000/api/v1/product/${productId}`);
// };

// console.log(state)
  
 


const {keyword} = useParams();


  useEffect(() => { 
    if (error) {
      alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage));
  }, [dispatch, alert, error, keyword, currentPage]);
  

  console.log('Resperpage', resPerPage)
  console.log('Product Count', productsCount)
  

  let count = productsCount
  if (keyword) {
    count = filteredProductsCount
  }


  // const handleSortBy = (event) => {
  //   const selectedSortBy = event.target.value;
  //   setSortBy(selectedSortBy);
  //   let sortedProducts = [];
  //   if (selectedSortBy === 'price-asc') {
  //     sortedProducts = [...products].sort((a, b) => a.price - b.price);
  //   } else if (selectedSortBy === 'price-desc') {
  //     sortedProducts = [...products].sort((a, b) => b.price - a.price);
  //   } else {
  //     sortedProducts = products;
  //   }
  //   dispatch(setProducts(sortedProducts));
  // };

  return (
    <Fragment>
      <MetaData title={'Buy Now!'} />

        <Fragment>
          <MetaData title={'Sir Jacks'} />
          <div className='flex  container py-6 mx-auto '>
            <div className='w-1/5'>
              <Sidebar/>
       
            </div>
          
            <div className='w-4/5 '>
              <h2 className='text-4xl mb-6 font-faceoff pl-6'>Products</h2>
              <div className='grid grid-cols-auto md:grid-cols-4 gap-6 text-center'>
                {products &&
                  products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
              </div>
            </div>
          </div>

          {resPerPage <= count && (
              <div className='flex flex-row justify-center w-4/5 mb-12 ml-auto'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={count}
                onChange={(pageNumber) => setCurrentPage(pageNumber)}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass='page-item bg-[#F4F7F6] border border-gray-300 h-16 w-16 mr-1 flex items-center justify-center cursor-pointer'
                linkClass='page-link flex items-center justify-center'
                innerClass='pagination flex flex-row'
                activeLinkClass='bg-[#555555] text-white h-16 w-screen  border-none outline-none focus:bg-[#555555]'
              />
            </div>
          )}
        
        </Fragment>
    </Fragment>
  );
};

export default Home;
