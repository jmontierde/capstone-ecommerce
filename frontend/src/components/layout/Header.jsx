import { Link } from "react-router-dom";
import Search from "./Search";
import { BsPerson, BsCart3 } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../actions/userActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { Badge, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getWishlist } from "../../actions/wishlistAction";
const Header = (keyword) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { wishlist } = useSelector((state) => state.getWishlist);

  console.log("Loading", loading);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const isMdScreen = useMediaQuery({ maxWidth: 768 });
  const isLgScreen = useMediaQuery({ maxWidth: 976 });
  const isXlScreen = useMediaQuery({ maxWidth: 1440 });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "auto"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [isMenuOpen]);

  function toggleProfileDropdown() {
    setIsProfileOpen(!isProfileOpen);
  }
  function toggleSearchBar() {
    setIsSearchOpen(!isSearchOpen);
  }
  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  return (
    <div className=" fixed top-0 w-screen z-20">
      <ToastContainer />
      <nav
        className="flex  py-3 sm:px-3 md:px-0 justify-around items-center  cursor-pointer font-helvetica  bg-[#1F1F1F] text-white
      "
      >
        <Link to="/">
          <h2 className="mr-16 uppercase sm:text-sm md:text-lg">
            Vapers Sidewalk
          </h2>
        </Link>

        <div className="block md:flex space-x-6  items-center uppercase">
          <ul
            className={
              isMenuOpen
                ? "hidden sm:hidden  lg:flex xl:flex "
                : "flex flex-col items-center space-x-6  justify-center uppercase fixed top-0 left-0 mt-16 w-full h-full bg-[#121212] z-30  xl:bg-slate-800 lg:hidden "
            }
            onClick={() => setIsMenuOpen(true)}
          >
            <li className="flex-none">
              <Link
                to="/"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355] "
              >
                Home
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/about"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                About
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/product"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                Product
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/customization"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                Customization
              </Link>
            </li>

            {/* <li className="flex-none">
              <Link
                to="/three"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                Customization 3D
              </Link>
            </li> */}
          </ul>
        </div>

        <div className="flex  items-center justify-center  text-[#ffffff] space-x-3 py-1 sm:space-x-6 ">
          <div className="relative ">
            {isSearchOpen && (
              <Search keyword={keyword} onClose={toggleSearchBar} />
            )}
            <Search
              className="m-auto text-xl md:text-2xl cursor-pointer"
              onClick={toggleSearchBar}
            />
          </div>

          <Link to="/wishlist" className="relative ">
            {wishlist.products && wishlist.products.length > 0 ? (
              <span className="text-[#b42828] text-sm font-semibold absolute bottom-6 left-6">
                {wishlist.products.length}
              </span>
            ) : (
              <span></span>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-8 h-8 hover:opacity-75 cursor-pointer p-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>

          <Link to={"/cart"} className="relative ">
            {cartItems.length > 0 ? (
              <span className="text-[#b42828] text-sm font-semibold absolute bottom-4 left-4">
                {cartItems.length}
              </span>
            ) : (
              <span></span>
            )}

            <BsCart3 className="text-xl hover:opacity-70"></BsCart3>
          </Link>

          {!loading && user && user.verificationStatus === "Verified" ? (
            <div className="relative ">
              <button
                id="dropdownHoverButton"
                onClick={toggleProfileDropdown}
                data-dropdown-toggle="dropdownHover"
                data-dropdown-trigger="hover"
                className="text-white font-medium text-sm text-center  rounded-full  inline-flex justify-center items-center"
                type="button"
              >
                <figure>
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="w-8 h-8 rounded-full"
                  />
                </figure>
                <span className="text-[#000] ml-2 font-bold">
                  {!isMdScreen || (!isLgScreen && user && user.name)}
                </span>
              </button>
              <div
                id="dropdownHover"
                className={`absolute top-12 -right-1/2 z-50 ${
                  isProfileOpen ? "block" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-44  dark:bg-gray-700`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownHoverButton"
                >
                  {user &&
                  user.role !== "admin" &&
                  user &&
                  user.role !== "staff" ? (
                    <Link
                      to="orders/me"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Orders
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/me"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/password"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Password
                  </Link>
                  <Link
                    to="/orders/me"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/refund"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Refund
                  </Link>

                  <Link
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    to="/product"
                    onClick={logoutHandler}
                  >
                    Sign out
                  </Link>
                </ul>
              </div>
            </div>
          ) : (
            !loading &&
            (console.log("F"),
            (
              <Link to="/login" className="m-auto text-2xl ">
                <BsPerson />
              </Link>
            ))
          )}
          {/* Hamburger */}
          {isMenuOpen ? (
            <svg
              viewBox="-0.5 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#fff"
              className={
                isMenuOpen
                  ? "w-4 h-4 block lg:hidden  "
                  : "w-4 h-4 hidden lg:hidden"
              }
              alt=""
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M2 12.32H22"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M2 18.32H22"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M2 6.32001H22"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={
                isMenuOpen
                  ? "hidden  w-4 h-4 lg:hidden"
                  : "block w-4 h-4 lg:hidden"
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                  fill="#fff"
                ></path>{" "}
              </g>
            </svg>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
