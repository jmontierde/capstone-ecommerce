import React, { useState } from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownMaintenance, setDropdownMaintenance] = useState(false);

  const [dropdownUsers, setDropdownUsers] = useState(false);

  return (
    <div className="w-2/12 container ">
      <nav className="bg-[#82838533] pl-6 py-6 h-screen">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <a
              className="dropdown-toggle cursor-pointer"
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

          <li
            onClick={() => setDropdownUsers(!dropdownUsers)}
            className="flex flex-col "
          >
            Users
            {dropdownUsers && (
              <>
                <Link to="/admin/users" className="pl-6">
                  <i className="fa fa-users"></i> All
                </Link>

                <Link to="/admin/verify/:userId" className="pl-6">
                  <i className="fa fa-users"></i> Verify User
                </Link>
              </>
            )}
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
            <Link onClick={() => setDropdownMaintenance(!dropdownMaintenance)}>
              Maintenance
              {dropdownMaintenance ? (
                <ul className="text-[#000] pl-6">
                  <li>
                    <Link to="/admin/maintenance/category">Category</Link>
                  </li>
                </ul>
              ) : (
                <span></span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
