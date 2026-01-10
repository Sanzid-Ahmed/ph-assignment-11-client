import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        navigate(location?.state || "/");
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="flex items-center justify-center my-40 bg-base-100">
      <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-lg p-8">
        <h3 className="text-3xl font-bold text-primary text-center mb-2">Welcome Back</h3>
        <p className="text-center text-base-content/70 mb-6">Please login to your account</p>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* Email */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-secondary">Email</span></label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="input input-bordered w-full border-base-300 input-primary focus:border-primary focus:ring-primary"
            />
            {errors.email && (
              <span className="text-accent text-sm mt-1">Email is required</span>
            )}
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold text-secondary">Password</span></label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Password"
              className="input input-bordered w-full border-base-300 input-secondary focus:border-primary focus:ring-primary"
            />
            {errors.password?.type === "required" && (
              <span className="text-accent text-sm mt-1">Password is required</span>
            )}
            {errors.password?.type === "minLength" && (
              <span className="text-accent text-sm mt-1">Password must be at least 6 characters</span>
            )}
          </div>

          <div className="text-right">
            <a className="link link-hover text-accent font-semibold">Forgot password?</a>
          </div>

          <button className="btn btn-primary w-full mt-4 hover:scale-105 transition-transform">
            Login
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
