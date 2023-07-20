import React, { useState } from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [dropdown, setDropdown] = useState(true);

  return (
    <div className="w-2/12 container ">
      <nav className="bg-[#82838533] pl-6 py-6 h-screen">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <a
              className="dropdown-toggle"
              onClick={() => setDropdown(!dropdown)}
            >
              Products
            </a>
            {dropdown ? (
              <ul className="text-[#000] pl-6">
                <li>
                  <Link to="/admin/products">All</Link>
                </li>

                <li>
                  <Link to="/admin/product">Create</Link>
                </li>
              </ul>
            ) : (
              <span></span>
            )}
          </li>
          <li>
            <Link to="/admin/orders">
              <i className="fa fa-shopping-basket"></i> Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              <i className="fa fa-users"></i> Users
            </Link>
          </li>

          <li>
            <Link to="/admin/reviews">
              <i className="fa fa-star"></i> Reviews
            </Link>
          </li>
          <li>
            <Link to="/admin/report">Report</Link>
          </li>
          <li>
            <Link to="/admin/create">Create Product</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
