import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {


    const { register, handleSubmit, formState: {errors} } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) =>{
        signInUser(data.email, data.password).then(result => {
            console.log(result.user);
            navigate(location?.state || '/')
        }).catch(error => {
            console.log(error);
        })
    }

  return (
    <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl p-10">
        <h3 className="text-3xl text-center">Welcome back</h3>
        <p className="text-center">Please login</p>
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="fieldset mx-auto">
          <label className="label">Email</label>
          <input type="email" {...register('email',{ require: true} )} className="input md:w-[400px]" placeholder="Email" />
          {
            errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
          }
          <label className="label">Password</label>
          <input type="password" {...register('password', {required: true, minLength: 6})} className="input md:w-[400px]" placeholder="Password" />
          {
            errors.password?.type === 'minLength' && <p className="text-red-500">Password must be 6 characters longer</p>
          }
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p className="text-center">New to AssetVerse? <br />
        <Link state={location.state} className="text-blue-800 underline" to="/register-hr">Register as HR</Link><br />
        <Link state={location.state} className="text-blue-400 underline" to="/register-employee">Register as employee</Link></p>
      </form>
    </div>
  );
};

export default Login;
