import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Product = ({product}) => {

    return (
    <Link to={`/product/${product._id}`}>
        <div className='w-full h-full'>
            <img className='w-2/3 h-2/3 mx-auto' src={product.images[0].url} alt="" />
            <h2 href={product.images[0].url}>{product.name}</h2>
            {/* Need pa ayusin */}
            <div className='flex justify-center items-center gap-1 w-32 mx-auto'>
            <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
            <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
            <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
            <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
            <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
            <span id='num-of-reviews' className='ml-3'>Review({product.numOfReviews})</span>
            </div>
            <h5 className='text-xl text-center mb-6'>₱{product.price}</h5>
        </div>
    </Link>
    )
}

export default Product