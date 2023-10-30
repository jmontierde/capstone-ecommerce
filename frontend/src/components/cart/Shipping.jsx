import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { saveShippingInfo } from "../../actions/cartActions";
import { Country, State, City } from "country-state-city";

const Shipping = () => {
  const { user } = useSelector((state) => state.auth);
  const { shippingInfo } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [state, setState] = useState(shippingInfo.state);

  const [countryCode, setCountryCode] = useState(shippingInfo.country); // Store ISO code
  const [citiesList, setCitiesList] = useState([]);

  // List of countries with ISO codes
  const countriesList = Country.getAllCountries();
  const statesList = State.getStatesOfCountry(countryCode);

  const selectedCountry = countriesList.find(
    (country) => country.isoCode === countryCode
  );

  const selectedState = statesList.find(
    (stateSelect) => stateSelect.isoCode === state
  );

  console.log("city", city);

  useEffect(() => {
    if (state) {
      const cities = City.getCitiesOfState(countryCode, state);
      setCitiesList(cities);
    }
  }, [state, countryCode]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingInfo({
        address,
        city,
        state: selectedState ? selectedState.name : "", // Check if selectedState is defined
        phoneNo,
        postalCode,
        country: selectedCountry ? selectedCountry.name : "",
      })
    );
    navigate("/order/confirm");
  };

  return (
    <div className=" mt-28">
      <CheckoutSteps />
      <div className="flex items-center justify-center font-sans">
        <form
          onSubmit={submitHandler}
          className="flex flex-col items-center justify-center gap-8 p-6 w-full lg:px-0 lg:w-1/2"
        >
          <div className="flex flex-col gap-6 w-full">
            <label htmlFor="address" className="mr-auto font-semibold text-xl">
              Country / Region
            </label>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <input
                type="text"
                placeholder="Street Address"
                className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <select
            value={countryCode}
            onChange={(e) => {
              const selectedCountryCode = e.target.value;
              setCountryCode(selectedCountryCode);
              setState(""); // Clear the selected state when changing the country
              setCity(""); // Clear the selected city when changing the country
            }}
            className="w-full p-4 bg-[#fff] border-2 border-[#5c5858]"
            required
          >
            {countriesList.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-4 bg-[#fff] border-2 border-[#5c5858]"
            required
          >
            {statesList.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {citiesList.length > 0 && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-4 bg-[#fff] border-2 border-[#5c5858]"
            >
              {citiesList.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Postalcode / ZIP"
            className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
            value={postalCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPostalCode(value);
            }}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="border w-full py-3 pl-3 text-lg border-[#5c5858]"
            value={user.phoneNumber}
            required
          />

          <button
            type="submit"
            className="bg-[#100f0fe1] w-full py-4 text-white text-xl uppercase hover-bg-[#000]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
