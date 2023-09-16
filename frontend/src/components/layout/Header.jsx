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
const Header = (keyword) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

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
      document.body.style.overflow = "hidden"; // Enable scrolling
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
    <>
      <ToastContainer />
      <nav className="container flex px-6  mx-auto py-6  w-screen justify-between items-center  cursor-pointer font-helvetica  ">
        <h2 className="mr-16 uppercase sm:text-sm md:text-lg">
          Vapers Sidewalk
        </h2>
        <div className="block md:flex space-x-6 items-center uppercase">
          <ul
            className={
              isMenuOpen
                ? "hidden sm:hidden  lg:flex xl:flex "
                : "flex flex-col items-center space-x-6  justify-center uppercase fixed top-0 left-0 mt-24 w-full h-full bg-[#ad5050]  xl:bg-slate-800 lg:hidden "
            }
            onClick={() => setIsMenuOpen(true)}
          >
            <li className="flex-none">
              <Link
                to="/"
                className="block py-2 px-4 rounded-lg hover:bg-[#6d5e5e] hover:text-white"
              >
                Home
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/product"
                className="block py-2 px-4 rounded-lg hover:bg-[#6d5e5e] hover:text-white"
              >
                Product
              </Link>
            </li>
            <li className="flex-none">
              <Link
                to="/three"
                className="block py-2 px-4 rounded-lg hover:bg-[#6d5e5e] hover:text-white"
              >
                Customization
              </Link>
            </li>
            {/* <li className="flex-none">
              <Link
                to="/chat"
                className="block py-2 px-4 rounded-lg hover:bg-[#6d5e5e] hover:text-white"
              >
                Chat
              </Link>
            </li> */}
          </ul>
        </div>

        <div className="flex  items-center justify-center  text-[#525151] space-x-3 py-1 sm:space-x-6 ">
          <div className="relative ">
            {isSearchOpen && (
              <Search keyword={keyword} onClose={toggleSearchBar} />
            )}
            <Search
              className="m-auto text-xl md:text-2xl cursor-pointer"
              onClick={toggleSearchBar}
            />
          </div>

          <Link to={"/cart"} className="relative ">
            {cartItems.length > 0 ? (
              <span className="text-[#b42828] text-sm font-semibold absolute bottom-4 left-4">
                {cartItems.length}
              </span>
            ) : (
              <span></span>
            )}

            <BsCart3 className="text-xl"></BsCart3>
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
                className={`absolute top-12 -right-1/2 z-10 ${
                  isProfileOpen ? "block" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
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
                    to="/shipping"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Address
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
          ) : !loading && user && user.verificationStatus === "Pending" ? (
            <div className="flex items-center justify-center">
              <Link to="/login" className="m-auto text-2xl ">
                <BsPerson />
              </Link>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="m-auto text-2xl ">
                <BsPerson />
              </Link>
            )
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
    </>
  );
};

export default Header;
