import React from "react";
import { NavLink } from "react-router-dom";

const activeLinkStyle = {
  fontWeight: "bold",
  color: "#e6e355",
  backgroundColor: "#333", // Add the background color you want here
};

const HeaderCategory = () => {
  return (
    <div className="bg-[#222] py-6">
      <ul className="flex items-center justify-center space-x-12 uppercase">
        <li>
          <NavLink
            to="/pod"
            className="hover:text-[#e6e355]"
            activeStyle={activeLinkStyle}
          >
            Pod
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pod-mod"
            className="hover:text-[#e6e355]"
            activeStyle={activeLinkStyle}
          >
            Pod Mod
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tank-mod"
            className="hover:text-[#e6e355]"
            activeStyle={activeLinkStyle}
          >
            Tank Mod
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pen-style"
            className="hover:text-[#e6e355]"
            activeStyle={activeLinkStyle}
          >
            Pen Style
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HeaderCategory;
