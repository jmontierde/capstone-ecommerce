import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
const Cart = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { cartItems } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(0);

  // const handleQuantityChange = (event) => {
  //   setQuantity(parseInt(event.target.value));
  // };

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleAddQuantity = (id, quantity, stock) => {
    const newQuantity = quantity + 1;

    if (newQuantity > stock) {
      return;
    }
    dispatch(addItemToCart(id, newQuantity));
  };

  const handleMinusQuantity = (id, quantity) => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      return;
    }
    dispatch(addItemToCart(id, newQuantity));
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-center font-bold text-4xl">Your Cart is Empty</h2>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-12 my-6">
            <h1>
              Cart:{" "}
              {cartItems.length > 1
                ? `${cartItems.length} items`
                : `${cartItems.length} item`}{" "}
            </h1>
            <div className="flex gap-6">
              <div className="flex flex-col outline-double w-2/3">
                <div className="flex items-center justify-between p-6 w-full text-center">
                  <h4 className="w-full bg-[#0232]">Product</h4>
                  <h4 className="w-full bg-[#0232]">Quantity</h4>
                  <h4 className="w-full bg-[#0232]">Price</h4>
                  <h4 className="w-full bg-[#0232]">Action</h4>
                </div>
                <hr class="h-px mb-3 bg-gray-200 border-0 dark:bg-gray-700" />
                {/* For Product */}
                {cartItems.map((cart) => (
                  <>
                    <div className="flex items-center justify-between text-center w-full p-6 gap-1">
                      <div className="w-full">
                        <img src={cart.image} className="w-32 mx-auto" />
                      </div>
                      <div className="w-full">
                        <div className="space-x-4 mb-6 w-48 p-3 my-3 rounded-sm  border border-[#171717] mx-auto">
                          <button
                            className="px-3 py-1 "
                            onClick={() =>
                              handleMinusQuantity(
                                cart.product,
                                cart.quantity,
                                cart.price
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            className="w-16 text-center bg-transparent outline-none appearance-none"
                            type="number"
                            value={cart.quantity}
                            onChange={() => cart.quantity}
                            min="1"
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                              appearance: "textfield",
                            }}
                          />
                          <button
                            className="px-3 py-1 "
                            onClick={() =>
                              handleAddQuantity(
                                cart.product,
                                cart.quantity,
                                cart.stock,
                                cart.price
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <h4 className="w-full">{cart.price}</h4>
                      <div className="w-full">
                        <img
                          src="./images/deleteHover.png"
                          alt="delete"
                          className="w-8 cursor-pointer mx-auto"
                          onClick={() => removeCartItemHandler(cart.product)}
                        />
                      </div>
                    </div>
                    <hr class="h-px mb-3 bg-gray-200 border-0 dark:bg-gray-700" />
                  </>
                ))}
              </div>
              {/* Checkout */}
              <div className="w-1/3 h-64 rounded-lg p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div className="flex justify-between">
                  <h5>Sub Total:</h5>
                  <p></p>
                </div>
                <div className="flex justify-between">
                  <h5>Est. Total:</h5>
                  <p>
                    {cartItems
                      .reduce(
                        (acc, cart) => acc + cart.quantity * cart.price,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <button className="bg-[#964747] text-white rounded py-3 px-6 my-6">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
