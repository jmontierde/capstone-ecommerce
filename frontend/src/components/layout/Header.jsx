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
        className="flex  py-3 sm:px-3 md:px-0 justify-around items-center  cursor-pointer font-helvetica  bg-[#111111] text-white
      "
      >
        <h2 className="mr-16 uppercase sm:text-sm md:text-lg">
          Vapers Sidewalk
        </h2>
        <div className="block md:flex space-x-6  items-center uppercase">
          <ul
            className={
              isMenuOpen
                ? "hidden sm:hidden  lg:flex xl:flex "
                : "flex flex-col items-center space-x-6  justify-center uppercase fixed top-0 left-0 mt-24 w-full h-full bg-[#ad5050] z-50  xl:bg-slate-800 lg:hidden "
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
                to="/product"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                Product
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/three"
                className="block py-2 px-4 rounded-lg hover:text-[#e6e355]  "
              >
                Customization
              </Link>
            </li>
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
                className="text-white font-medium text-sm text-center inline-flex items-center"
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
            <img
              src="/images/hamburger-menu.png"
              className={
                isMenuOpen
                  ? "w-4 h-4 block lg:hidden  "
                  : "w-4 h-4 hidden lg:hidden"
              }
              alt=""
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          ) : (
            <img
              src="/images/close-menu.png"
              className={
                isMenuOpen
                  ? "hidden  w-4 h-4 lg:hidden"
                  : "block w-4 h-4 lg:hidden"
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
