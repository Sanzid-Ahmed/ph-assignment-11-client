import React from "react";

const JoinHRManagerPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Join as HR Manager</h1>
      <form className="w-full max-w-sm bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button className="btn w-full bg-primary py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default JoinHRManagerPage;
