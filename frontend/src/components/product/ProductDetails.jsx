import React, { Fragment, useState, useEffect } from 'react'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
// import ListReviews from '../review/ListReviews'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails} from '../../actions/productActions'

import { useParams } from 'react-router-dom'


const ProductDetails = () => {

  
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, product } = useSelector(state => state.productDetails)


  useEffect(() => {
    // dispatch(getProductDetails(match.params.id))
    dispatch(getProductDetails(id))
    console.log(id)

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

}, [dispatch, alert, error, id])


  console.log(product.id)
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

  console.log(product)



  return (
    <div className='flex'>
      <div className='w-1/2'>
        <img className='h-2/3 mx-auto ' src={product.images[0].url} alt="" />
      </div>
      <div className=' w-1/2 p-12'>
        <h2 className='font-bold text-xl'>{product.name}</h2>
        <h3 className='py-6 text-lg'>P{product.price}</h3>
        <p className='space-y-6'>{product.description}</p>
        <label htmlFor="quantity">Quantity:</label>
        <div className="flex items-center space-x-4 my-6 w-48 p-3 rounded-sm  border border-[#171717]">
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
      </div>
    </div>
  )
}

export default ProductDetails

// import React from 'react';
// import { useParams } from 'react-router-dom';
// const ProductDetails = ({ products }) => {
//   const { productId } = useParams();
//   const product = products.find((p) => p._id === productId);


//   return (
//     <div>
//       <p>{product.price}</p>
//     </div>
//   );
// };
// export default ProductDetails