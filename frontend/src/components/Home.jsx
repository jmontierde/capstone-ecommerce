import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'
import Sidebar from './Sidebar'
import Product from './product/Product'
import MetaData from './layout/MetaData'
import Loader from './layout/Loader'
import Pagination from 'react-js-pagination'
import { useAlert } from 'react-alert'

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(
    state => state.products
  )
  const navigate = useNavigate()
  const alert = useAlert()
  const { keyword } = useParams()

  useEffect(() => {
    if (keyword) {
      dispatch(getProducts(keyword, currentPage))
    } else {
      dispatch(getProducts('', currentPage))
    }
  }, [dispatch, keyword, currentPage])

  const count = keyword ? filteredProductsCount : productsCount

  return (
    <Fragment>
      <MetaData title={'Sir Jacks'} />
      <div className='flex container py-6 mx-auto'>
        <div className='w-1/5'>
          <Sidebar />
        </div>
        <div className='w-4/5'>
          <h2 className='text-4xl mb-6'>Products</h2>
          <div className='grid grid-cols-auto md:grid-cols-4 gap-6 text-center h-screen'>
          {products && products.map(product => (
            <Product key={product._id} product={product} />
          ))}
          </div>
          <div className='flex justify-center mt-6'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resPerPage}
              totalItemsCount={count}
              onChange={pageNumber => setCurrentPage(pageNumber)}
              nextPageText={'Next'}
              prevPageText={'Prev'}
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
  )
}

export default Home
