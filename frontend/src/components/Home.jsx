import React from 'react'

import Sidebar from './Sidebar'
import Product from './product/Product'

import { Fragment, useEffect } from 'react'
import MetaData from './layout/MetaData'
import Loader from './layout/Loader'

import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from '../actions/productActions'
import { useAlert } from 'react-alert'
// import ProductDetails from './product/ProductDetails'


const Home = ({ product }) => {
  
  const alert = useAlert();

  const dispatch = useDispatch();

  const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)


  const navigate = useNavigate();

  const handleProductClick = (productId) => {
      navigate(`http://localhost:7000/api/v1/product/${productId}`);
  };

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <Fragment>
      {loading ? <Loader/> : (
        <Fragment>
          <MetaData title = {'Sir Jacks'}/>
            <div className='flex container py-6 mx-auto '>
              <div className="w-1/5">
                <Sidebar/>
              </div>
              <div className='w-4/5'>
                <h2 className='text-4xl mb-6'>Products</h2> 
                <div className='grid grid-cols-auto md:grid-cols-4 gap-6 text-center'>
                  {products && products.map(product => (
                      <Product key={product._id} product={product}/>
                  ))}
                </div>
                {/* <ProductDetails productDetails={products}/> */}
              </div>
            </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default Home
