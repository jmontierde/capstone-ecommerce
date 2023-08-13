import { Link } from "react-router-dom";
import Search from "./Search";
import { BsPerson, BsCart3 } from "react-icons/bs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../actions/userActions";
const Header = (keyword) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully.");
  };

  return (
    <>
      <nav className="flex container py-6 px-12 m-auto justify-between items-center font-custom cursor-pointer">
        <ul className="flex space-x-6 items-center justify-center uppercase  ">
          <h2 className="mr-16 font-bold text-2xl uppercase">
            Vapers Sidewalk
          </h2>

          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/product">Product</Link>
          </li>
          <li>
            <Link to="/customization">Customization</Link>
          </li>
          <li>
            <Link to="/three">Three</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/find/chat">Fimnd</Link>
          </li>
        </ul>

        <div className="flex text-[#525151] space-x-6 py-3  items-center justify-center ">
          <Search keyword={keyword} />

          <Link to={"/cart"} className=" mb-4">
            {cartItems.length > 0 ? (
              <span className="text-[#b42828] font-semibold ml-5">
                {cartItems.length}
              </span>
            ) : (
              <span></span>
            )}

            <BsCart3 className="text-2xl" />
          </Link>
          {user ? (
            <div className="relative flex items-center justify-center">
              <button
                id="dropdownHoverButton"
                onClick={toggleDropdown}
                data-dropdown-toggle="dropdownHover"
                data-dropdown-trigger="hover"
                className="text-white font-medium  text-sm  text-center inline-flex items-center"
                type="button"
              >
                <figure>
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="w-10 h-10  rounded-full"
                  />
                </figure>
                <span className="text-[#000] ml-2 font-bold">
                  {user && user.name}
                </span>
              </button>
              <div
                id="dropdownHover"
                className={`absolute -right-16  top-12 z-10 ${
                  isOpen ? "block" : "hidden"
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
          ) : (
            !loading && (
              <Link to="/login" className="m-auto text-2xl ">
                <BsPerson />
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
