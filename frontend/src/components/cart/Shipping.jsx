import React from "react";
import { loadUser } from "../../actions/userActions";
import { saveShippingInfo } from "../../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import CheckoutSteps from "./CheckoutSteps";
const Shipping = () => {
  const { user } = useSelector((state) => state.auth);
  const { shippingInfo } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(user);
  console.log("SHIPPING", shippingInfo);

  const countriesList = Object.values(countries);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [country, setCountry] = useState(shippingInfo.country);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }));
    navigate("/order/confirm");
  };
  return (
    <>
      <CheckoutSteps />
      <div className="flex items-center justify-center h-screen outline-dotted font-sans">
        <form
          onSubmit={submitHandler}
          className="flex flex-col  items-center justify-center gap-8 w-1/2"
        >
          <label
            htmlFor="personal-info"
            className="mr-auto mt-6 font-semibold text-xl"
          >
            Personal Information
          </label>
          <div className="flex gap-2 w-full ">
            <input
              type="text"
              placeholder="First Name"
              className="border w-full py-3 pl-3 text-lg  border-[#5c5858]"
              value={user.firstName}
              disable="true"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
              value={user.lastName}
              disable="true"
            />
          </div>

          {/* Address */}
          <label htmlFor="address" className="mr-auto font-semibold text-xl">
            Country / Region
          </label>

          <div className="flex gap-2 w-full">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="Street Address"
                className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc. (Optional)"
                className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Town / City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
            required
          />
          <input
            type="text"
            placeholder="Postalcode / ZIP"
            className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
          <select
            id="countries-list"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-4 bg-[#fff] border-2 border-[#5c5858]"
            required
          >
            {countriesList.map((country) => (
              <option
                key={country.name}
                value={country.name}
                className="border-2 border-[#5c5858]"
              >
                {country.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#100f0fe1] w-full py-4 text-white text-xl uppercase hover:bg-[#000]"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Shipping;
