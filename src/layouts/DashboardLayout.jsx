import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiPlusSquare,
  FiRepeat,
  FiUsers,
  FiTrendingUp,
  FiUser,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPieChart,
} from "react-icons/fi";
import Logo from "../components/common/Logo";

const DashboardLayout = () => {
  const { role } = useRole();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();



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
  

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="bg-base-100 font-sans">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content flex flex-col">
          {/* Top Navbar */}
          <nav className="navbar bg-base-100 border-b border-base-200 px-4 sticky top-0 z-20 min-h-20 w-11/12 lg:w-12/15 mx-auto">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
                <FiMenu className="size-6" />
              </label>
            </div>

            <div className="flex-1 px-2 font-black text-2xl tracking-tight">
              <Logo></Logo>
            </div>
            
            
            <div className="flex-none">
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
                       <button onClick={handleLogout} className="text-error font-bold">
                         <FiLogOut className="text-lg" /> Logout
                       </button>
                     </li>
                   </ul>
                 </div>
            </div>
            
          </nav>

          {/* Page Content Holder */}
          <main className="p-6 md:p-10 min-h-[calc(100vh-64px)] bg-base-200/30">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-30">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="flex flex-col min-h-full bg-base-100 border-r border-base-200 w-64 lg:w-72">
            
            {/* Sidebar Branding - Visible only in Sidebar */}
            <ul className="menu p-4 w-full grow gap-2 text-base-content font-medium">
              <li>
                <NavLink to="/" end>
                  <FiHome className="size-5" /> Homepage
                </NavLink>
              </li>

              <div className="divider opacity-50 px-4"></div>

              {role === "hr" ? (
                <>
                  <li><NavLink to="/dashboard/hr-alytics"><FiPieChart className="size-5" /> Analytics</NavLink></li>
                  <li><NavLink to="/dashboard/asset-lists"><FiPackage className="size-5" /> Asset List</NavLink></li>
                  <li><NavLink to="/dashboard/add-asset"><FiPlusSquare className="size-5" /> Add Asset</NavLink></li>
                  <li><NavLink to="/dashboard/all-requests"><FiRepeat className="size-5" /> All Requests</NavLink></li>
                  <li><NavLink to="/dashboard/employees"><FiUsers className="size-5" /> Employee List</NavLink></li>
                  <li><NavLink to="/dashboard/upgrade"><FiTrendingUp className="size-5" /> Upgrade Package</NavLink></li>
                  <li><NavLink to="/dashboard/hr-profile"><FiUser className="size-5" /> Profile</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/dashboard/my-assets"><FiPackage className="size-5" /> My Assets</NavLink></li>
                  <li><NavLink to="/dashboard/request-asset"><FiPlusSquare className="size-5" /> Request Asset</NavLink></li>
                  <li><NavLink to="/dashboard/my-team"><FiUsers className="size-5" /> My Team</NavLink></li>
                  <li><NavLink to="/dashboard/employee-profile"><FiUser className="size-5" /> Profile</NavLink></li>
                </>
              )}
            </ul>

            {/* Logout Section at Bottom */}
            <div className="p-4 border-t border-base-200">
              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-block gap-2 border-none hover:bg-error/10"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;