import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/dashboard/EmployeeSidebar';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmployeeDashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="employee-sidebar-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col bg-gray-50">
        
        <div className="navbar bg-white shadow-sm lg:hidden sticky top-0 z-10">
          <div className="flex-none">
            <label htmlFor="employee-sidebar-drawer" className="btn btn-square btn-ghost">
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link to="/" className="text-xl font-bold text-secondary">AssetVerse</Link>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-grow">
          <Outlet />
        </div>

        <footer className="footer footer-center p-4 bg-base-300 text-base-content border-t mt-auto">
          <aside>
            <p>AssetVerse Employee Dashboard - All rights reserved.</p>
          </aside>
        </footer>
      </div>

      <div className="drawer-side">
        <label htmlFor="employee-sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <EmployeeSidebar />
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;