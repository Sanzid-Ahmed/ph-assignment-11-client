import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingBasket, FaLaptop, FaUsers, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { name: 'My Assets', path: '', icon: FaLaptop }, 
  { name: 'Request an Asset', path: 'request-asset', icon: FaShoppingBasket },
  { name: 'My Team', path: 'my-team', icon: FaUsers },
];

const EmployeeSidebar = () => {
  const { user, logOut } = useAuth();
  
  const handleLogout = () => {
    logOut().catch(err => console.error("Logout Error:", err));
  };

  return (
    <div className="bg-base-200 w-64 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold text-secondary mb-6 border-b pb-4">
          Employee Dashboard
        </div>

        <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg bg-base-100 shadow-sm">
            <div className="avatar">
                <div className="w-10 rounded-full">
                    <img src={user?.photoURL || 'https://i.ibb.co/L9593z1/default-avatar.png'} alt="Profile" />
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold">{user?.displayName || 'Employee'}</p>
                <p className="text-xs text-gray-500">Role: Employee</p>
            </div>
        </div>

        <ul className="menu space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                end={item.path === ''}
                className={({ isActive }) => 
                  isActive 
                    ? 'bg-secondary text-white font-semibold' 
                    : 'text-gray-700 hover:bg-gray-300'
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t pt-4 space-y-2">
        <NavLink 
          to="/profile"
          className={({ isActive }) => 
            isActive 
              ? 'btn btn-ghost w-full justify-start bg-base-300' 
              : 'btn btn-ghost w-full justify-start'
          }
        >
          <FaUserCircle className="w-5 h-5" /> Profile
        </NavLink>
        <button 
          onClick={handleLogout} 
          className="btn btn-error w-full text-white"
        >
          <FaSignOutAlt className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;