import React from 'react'

import Sidebar from './Sidebar'
import Product from './product/Product'

import { Fragment, useEffect, useState } from 'react'
import MetaData from './layout/MetaData'
import Loader from './layout/Loader'

import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from '../actions/productActions'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
// import ProductDetails from './product/ProductDetails'


const Home = () => {
  
    const [currentPage, setCurrentPage] = useState(1); // Current Page is 1

  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, products, error, productsCount, resPerPage, filteredProductsCount, keyword } = useSelector(state => state.products)

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
      navigate(`http://localhost:7000/api/v1/product/${productId}`);
  };

  useEffect(() => {
    dispatch(getProducts(currentPage))
  }, [dispatch, currentPage, keyword])

  let count = productsCount;
    if (keyword) {
        count = filteredProductsCount
    }

  return (
    <Fragment>
   
        <Fragment>
          <MetaData title = {'Sir Jacks'}/>
            <div className='flex container py-6 mx-auto '>
              <div className="w-1/5">
                <Sidebar/>
              </div>
              <div className='w-4/5'>
                <h2 className='text-4xl mb-6'>Products</h2> 
                <div className='grid grid-cols-auto md:grid-cols-4 gap-6 text-center  h-screen'>
                  {products && products.map(product => (
                      <Product key={product._id} product={product}/>
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-6 ">
                  <Pagination 
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productsCount}
                    onChange={(pageNumber) => setCurrentPage(pageNumber)}
                    nextPageText= {'Next'}
                    prevPageText= {'Prev'}
                    firstPageText={'First'}
                    lastPageText={'Last'}
                    itemClass='page-item border border-gray-300 mr-1 w-20 py-6 flex justify-center items-center cursor-pointer hover:bg-gray-300'
                    linkClass='page-link'
                    innerClass='flex items-center'
                    activeClass='bg-gray-300'
                  />
                </div>


              </div>
            </div>
        </Fragment>
    </Fragment>
  )
}

export default Home
