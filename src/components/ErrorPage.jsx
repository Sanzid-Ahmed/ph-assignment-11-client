import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { FaExclamationCircle, FaHome, FaArrowLeft } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6 font-sans">
      <div className="max-w-lg w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl border border-base-300">
        
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-error/20 blur-3xl rounded-full"></div>
            <FaExclamationCircle className="text-error text-9xl relative z-10 animate-bounce-slow" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-7xl font-black text-neutral">
            {error.status || "Oops!"}
          </h1>
          <h2 className="text-2xl font-bold text-gray-700">
            {error.statusText || "Something went wrong"}
          </h2>
          <p className="text-gray-500 font-medium">
            {error.status === 404 
              ? "The page you are looking for doesn't exist or has been moved." 
              : "An unexpected error occurred. Please try again later."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline btn-neutral rounded-2xl px-8"
          >
            <FaArrowLeft /> Go Back
          </button>
          <Link to="/" className="btn btn-primary rounded-2xl px-8 text-white shadow-lg">
            <FaHome /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;