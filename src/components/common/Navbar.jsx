import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";

import Logo from "./Logo";
import Login from "../../pages/public/Login";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const handleLogOut = () => {
    logOut().catch((error) => console.log(error));
  };

  // Common link for everyone
  const homeLink = (
    <>
      <li>
        <NavLink to="/" className="flex items-center gap-2">
          <Icon icon="fluent:home-24-filled" width={22} />
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/features" className="flex items-center gap-2">
          <Icon icon="fluent:star-24-filled" width={22} />
          Features
        </NavLink>
      </li>
    </>
  );

  // Extra links
  const extra = (
    <>
      <li>
        <NavLink to="/about-us" className="flex items-center gap-2">
          <Icon icon="fluent:building-24-filled" width={22} />
          About Us
        </NavLink>
      </li>
    </>
  );

  // Links for Unauthenticated Users
  const publicLinks = (
    <>
      {homeLink}

      <li>
        <NavLink to="/register-hr" className="flex items-center gap-2">
          <Icon icon="fluent:person-briefcase-24-filled" width={22} />
          Join as HR
        </NavLink>
      </li>

      <li>
        <NavLink to="/register-employee" className="flex items-center gap-2">
          <Icon icon="fluent:person-24-filled" width={22} />
          Join as Employee
        </NavLink>
      </li>

      {extra}
    </>
  );

  // Links for HR Managers
  const hrLinks = (
    <>
      {homeLink}
      <li>
        <NavLink to="/dashboard/hr-alytics">Analytics</NavLink>
      </li>

      <li>
        <NavLink to="/dashboard/asset-lists">Asset List</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/add-asset">Add Asset</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/all-requests">All Requests</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/employees">My Team</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/upgrade">Upgrade Package</NavLink>
      </li>

      <li>
        <NavLink to="/dashboard/hr-profile">Profile</NavLink>
      </li>
    </>
  );

  // Links for Employees
  const employeeLinks = (
    <>
      {homeLink}
      <li>
        <NavLink to="/dashboard/my-assets">My Assets</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/my-team">My Team</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/request-asset">Request Asset</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/employee-profile">Profile</NavLink>
      </li>
    </>
  );

  const navLinks = !user
    ? publicLinks
    : role === "hr"
    ? hrLinks
    : employeeLinks;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md border-b border-base-200 w-full h-[75px]">
      <div className="navbar container w-9/12 lg:w-10/12 mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <FiMenu className="h-7 w-7 text-primary" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              {navLinks}
            </ul>
          </div>
          <Logo></Logo>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 font-medium">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {user ? (
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="btn btn-ghost btn-circle avatar border border-base-300"
    >
      <div className="w-10 rounded-full">
        <img
          alt="User Profile"
          src={user?.photoURL || "https://i.ibb.co.com/mR7093X/user-placeholder.png"}
        />
      </div>
    </div>
    <ul
      tabIndex={0}
      className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-base-200"
    >
      {/* User Name Header */}
      <li className="px-4 py-2 font-black text-primary truncate border-b border-base-200 mb-2">
        {user?.displayName || "User"}
      </li>

      {/* Profile Link */}
      <li>
        <Link to={role === "hr" ? "/dashboard/hr-profile" : "/dashboard/employee-profile"}>
          <FiUser className="text-lg" /> Profile
        </Link>
      </li>

      {/* Theme Toggle Section - Moved inside for cleaner look */}
      <li className="border-y border-base-200 my-1 py-1">
        <div className="flex justify-between items-center active:bg-transparent hover:bg-transparent">
          <span className="flex items-center gap-2 font-medium">
             {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            onChange={toggleTheme}
            checked={theme === "dark"}
          />
        </div>
      </li>

      {/* Logout Button */}
      <li>
        <button onClick={handleLogOut} className="text-error font-bold">
          <FiLogOut className="text-lg" /> Logout
        </button>
      </li>
    </ul>
  </div>
) : (
  <div className="flex justify-center items-center gap-4">
    {/* Theme Toggle for Guests */}
    <div className="tooltip tooltip-bottom" data-tip="Change Theme">
      <input
        type="checkbox"
        className="toggle toggle-primary toggle-sm md:toggle-md"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
    </div>

    {/* Sign In Button & Modal */}
    <button
      className="btn btn-primary btn-sm md:btn-md px-6"
      onClick={() => document.getElementById("my_modal_4").showModal()}
    >
      Sign in
    </button>
    
    <dialog id="my_modal_4" className="modal backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-5xl rounded-[2.5rem] border border-base-300">
        <Login />
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
