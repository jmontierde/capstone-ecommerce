import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../actions/userActions";
const Sidebar = () => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownMaintenance, setDropdownMaintenance] = useState(false);
  const [dropdownUsers, setDropdownUsers] = useState(false);
  const [dropdownRefund, setDropdownRefund] = useState(false);

  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.auth);

  console.log("Auth", user.role);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(allUsers());
  // }, [dispatch]);

  const a = users.filter((uFilt) => uFilt.role === "staff").map((u) => u);

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

          {user.role === "admin" ? (
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
          ) : (
            <li
              onClick={() => setDropdownUsers(!dropdownUsers)}
              className="flex flex-col "
            >
              Users
              {dropdownUsers && (
                <>
                  <Link to="/admin/verify/:userId" className="pl-6">
                    <i className="fa fa-users"></i> Verify User
                  </Link>
                </>
              )}
            </li>
          )}

          <li>
            <Link to="/admin/reviews">
              <i className="fa fa-star"></i> Reviews
            </Link>
          </li>
          <li>
            <Link onClick={() => setDropdownRefund(!dropdownRefund)}>
              Refund
              {dropdownRefund ? (
                <ul className="text-[#000] pl-6">
                  <li>
                    <Link to="/admin/refunds">All</Link>
                  </li>
                  <li>
                    <Link to="/admin/update/refund">Update Refund</Link>
                  </li>
                </ul>
              ) : (
                <span></span>
              )}
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
                  <li>
                    <Link to="/admin/maintenance/newTerm">
                      Create Terms and Conditions
                    </Link>
                  </li>

                  <li>
                    <Link to="/admin/maintenance/update/term">
                      Update Terms
                    </Link>
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
