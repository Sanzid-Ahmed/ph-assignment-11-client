import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const handleLogOut = () => {
    logOut().catch((error) => console.log(error));
  };

  // Common link for everyone
  const homeLink = (
    <li>
      <NavLink to="/">Home</NavLink>
    </li>
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
        <NavLink to="/dashboard/upgrade">
           Upgrade Package
        </NavLink>
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

  console.log(role);
  const navLinks = !user
    ? publicLinks
    : role === "hr"
    ? hrLinks
    : employeeLinks;

  return (
    <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200 w-19/20 mx-auto">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <FiMenu className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
            >
              {navLinks}
            </ul>
          </div>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12">
              A
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              Asset<span className="text-primary">Verse</span>
            </span>
          </Link>
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
            <Link to="/login" className="btn btn-primary btn-sm md:btn-md px-6">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
