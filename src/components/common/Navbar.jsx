import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import Logo from "./Logo";
import Login from "../../pages/public/Login";
import { FaBuilding, FaHome } from "react-icons/fa";

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
        <NavLink to="/"><FaHome />Home</NavLink>
      </li>
      <li>
        <NavLink to="/about-us"><FaBuilding />About Us</NavLink>
      </li>
    </>
  );

  // Links for Unauthenticated Users
  const publicLinks = (
    <>
      {homeLink}
      <li>
        <NavLink to="/register-employee">Join as Employee</NavLink>
      </li>
      <li>
        <NavLink to="/register-hr">Join as HR</NavLink>
      </li>
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
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co.com/mR7093X/user-placeholder.png"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
              >
                <li className="px-4 py-2 font-bold text-primary truncate border-b border-base-100 mb-2">
                  {user?.displayName || "User"}
                </li>
                <li>
                  <Link
                    to={
                      role === "hr"
                        ? "/dashboard/hr-profile"
                        : "/dashboard/employee-profile"
                    }
                  >
                    <FiUser /> Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogOut} className="text-error">
                    <FiLogOut /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />

              {/* Open the modal using document.getElementById('ID').showModal() method */}
              {/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn btn-primary btn-sm md:btn-md px-6" onClick={()=>document.getElementById('my_modal_4').showModal()}>Sign in</button>
<dialog id="my_modal_4" className="modal">
  <div className="modal-box w-11/12 max-w-5xl">
    <Login></Login>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button, it will close the modal */}
        <button className="btn">Close</button>
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
