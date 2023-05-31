import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SidebarAccount = () => {
  const [dropdown, setDropDown] = useState(false);

  return (
    <div className="flex gap-3 flex-col p-6 container border border-[#9a9a9a] h-screen bg-[#fff] w-1/5">
      <h2>My Account</h2>
      <Link className="flex">
        <img src="images/user.png" alt="personal" className="w-5 mr-2" />
        Personal
      </Link>
      <Link className="flex">
        <img src="images/billing.png" alt="billing" className="w-5 mr-2" />
        Billing
      </Link>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setDropDown((prevDrop) => !prevDrop)}
      >
        <img src="images/setting.png" alt="settings" className="w-5 mr-2" />
        Settings
        <img
          src="images/dropdown.png"
          alt="dropdown"
          className="w-3 h-3 ml-1"
        />
      </div>
      {dropdown && (
        <ul className="flex flex-col">
          <Link to="/me">Profile</Link>
          <Link to="/password">Password</Link>
        </ul>
      )}
    </div>
  );
};

export default SidebarAccount;
