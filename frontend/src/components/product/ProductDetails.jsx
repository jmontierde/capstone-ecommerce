import React, { Fragment, useState, useEffect } from 'react'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import Pagination from 'react-js-pagination'

// import ListReviews from '../review/ListReviews'
import { FaStar } from 'react-icons/fa';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails} from '../../actions/productActions'

import { useParams } from 'react-router-dom'


const ProductDetails = () => {

  
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [comment, setComment] = useState('');



  
  const { loading, error, product } = useSelector(state => state.productDetails)




  useEffect(() => {
    dispatch(getProductDetails(id))

    if (error) {
        alert.error(error);
        dispatch(clearErrors())
    }

    // if (reviewError) {
    //     alert.error(reviewError);
    //     dispatch(clearErrors())
    // }

    // if (success) {
    //     alert.success('Reivew posted successfully')
    //     dispatch({ type: NEW_REVIEW_RESET })
    // }

}, [dispatch, alert, error,  id])


// Ratings






  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleAddQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleMinusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  // Ratings


  const [rating, setRating] = useState(product.ratings || 0);
  const [hover, setHover] = useState(0);

  const handleClick = (newRating) => {
    setRating(newRating);
  };

  const handleMouseOver = (newHover) => {
    setHover(newHover);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  // console.log(product)
  // const image = product.images[0];

  return (
    <div className='flex h-screen'>
        <div className='h-full  w-1/2 flex justify-center items-center  mx-auto'>
          {product.images.length > 0 && (
            <img src={product.images[0].url} alt={product.name} className='w-2/3'/>
          )}
        </div>
        <div className='w-1/2 mx-auto  flex justify-center  flex-col text-left p-12'>
          <h2 className='font-bold text-lg'>{product.name}</h2>

          {/* Ratings */}

          <div className='flex '>
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={ratingValue}
                  id='star'
                  // className="star"
                  color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                  size={30}
                  onClick={() => handleClick(ratingValue)}
                  onMouseOver={() => handleMouseOver(ratingValue)}
                  onMouseLeave={() => handleMouseLeave()}
                />
              );
            })}
            <p className='mx-3'>{rating} out of 5 stars</p><br />
            <p>({product.numOfReviews})</p>
        </div>
          
          <p>{product.description}</p>
          {/* Status */}
          <div className="flex mt-3">
            <h3 className='font-bold mr-2'>Available:</h3><span className={product.stock > 0 ? 'font-bold text-[#0db313]' : 'text-[#770505]'}>{product.stock > 0 ? 'In Stock' : "Out of Stock"}</span>
          </div>

          <label htmlFor="quantity" className='my-3'>Quantity:</label>
          <div className="flex items-center space-x-4 mb-6 w-48 p-3 rounded-sm  border border-[#171717]">
            <button
              className="px-3 py-1 "
              onClick={handleMinusQuantity}>-</button>
            <input
              className="w-16 text-center bg-transparent outline-none appearance-none"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "textfield",
              }}/>
            <button
              className="px-3 py-1 "
              onClick={handleAddQuantity}>+</button>
          </div>
          <button className='bg-[#000] w-48 p-6 text-[#fff] hover:bg-[#222222]'>Add to Cart</button>
        </div>
    </div>
  )
}

export default ProductDetails
