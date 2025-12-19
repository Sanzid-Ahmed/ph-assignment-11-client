import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const RegisterEmployee = () => {



    const { register, handleSubmit, formState: {errors} } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();


    const handleRegistration = (data) =>{

      const profileImage = data.photo[0];

        registerUser(data.email, data.password).then(() => {

            //1. store the image and get the photo url. 
            const formData = new FormData();
            formData.append('image', profileImage);

            //2. send the photo to store and get the url. 
            const Image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`
            axios.post(Image_API_URL, formData).then( res => {
              const photoURL =  res.data.data.url;


              //NEW create user in the data base:
              const userInfo = {
                name: data.name,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                profileImage: photoURL,
              }
              axiosSecure.post('/register-employee', userInfo).then(res =>{
                if(res.data.insertedId){
                  console.log('user created in the data base')
                }
              })

              //3. update user profile
              const userProfile = {
              displayName: data.name,
              photoURL: photoURL,
            }
            updateUserProfile(userProfile).then( ()=> {
              console.log('user profile updated')
              navigate(location.state || '/');
            }).catch(error => console.log(error))

              })
        }).catch(error => {
            console.log(error);
        })

    }

  return (
    <div className="card bg-base-100 w-full mx-auto shrink-0 shadow-2xl p-10">
      <h3 className="text-3xl text-center">Welcome to AssetVerse</h3>
        <p className="text-center">Please Register as Employee</p>
      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset mx-auto">

          {/* photo image field */}
          <label className="label">Photo</label>
          <input type="file" {...register('photo', {required: true})} className="file-input md:w-[400px]" placeholder="Your photo" />
            {errors.name?.type ==='required' && <p className="text-red-500">Photo is required. </p>}
          
          
          {/* Name field */}
          <label className="label">Name</label>
          <input type="text" {...register('name', {required: true})} className="input md:w-[400px]" placeholder="Your name" />
            {errors.name?.type ==='required' && <p className="text-red-500">Name is required. </p>}
          

            {/* Date of Birth field */}
          <label className="label">Date of Birth</label>
          <input
            type="date"
            {...register("dateOfBirth", { required: true })}
            className="input md:w-[400px]"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500">Date of Birth is required.</p>
          )}


          
          {/* Email field */}
          <label className="label">Email</label>
          <input type="email" {...register('email', {required: true})} className="input md:w-[400px]" placeholder="Email" />
            {errors.email?.type ==='required' && <p className="text-red-500">Email is required. </p>}

          {/* Password field */}
          <label className="label">Password</label>
          <input type="password" {...register('password', {required:true, minLength: 6, pattern: /^[A-Za-z]+$/i})}className="input md:w-[400px]" placeholder="Password" />
          {errors.password?.type==='required' && <p className="text-red-500">Password is required.</p>}
          {
            errors.password?.type==='minLength' && <p className="text-red-500">Password must be 6 characters or longer</p>
          }
          {
            errors.password?.type==='pattern' && <p className="text-red-500">password must have </p>
          }


          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p className="text-center">Already have an account? <Link state={location.state} className="text-blue-400 underline" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterEmployee;
