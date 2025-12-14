import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { useForm } from "react-hook-form";

const LoginPage = () => {

  const { signInUser, signGoogle } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
  } = useForm()

  const handleLogIn = data => {
    
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="w-full max-w-sm bg-white p-6 rounded shadow" onSubmit={handleSubmit(handleLogIn)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded"
            {...register('email')}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded"
            {...register('password')}
          />
        </div>
        <button className="btn w-full bg-primary py-2 rounded">
          Log In
        </button>
        <div className="text-center mt-4">
          <p>Don't have an account? </p>
          <Link to="/join-employee" className="text-blue-500 underline mx-2">
            Register as Employee
          </Link>
          <p></p>
          
          <Link to="/join-hr" className="text-purple-500 underline mx-2">
            Register as HR
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
