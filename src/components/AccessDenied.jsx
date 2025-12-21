import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl border border-base-300">
        <div className="flex justify-center">
          <div className="bg-error/10 p-6 rounded-full">
            <FaExclamationTriangle className="text-error text-6xl animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-neutral">Access Denied</h2>
          <p className="text-gray-500 font-medium">
            Oops! You don't have permission to access this page. This area is restricted to HR Administrators only.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/" className="btn btn-primary btn-wide rounded-xl text-white shadow-lg">
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;