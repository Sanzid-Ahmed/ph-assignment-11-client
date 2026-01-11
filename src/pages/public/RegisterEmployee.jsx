import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import EmployeeHero from "../../components/employeeComponents/EmployeeHero";
import Login from "./Login";

const RegisterEmployee = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleRegistration = (data) => {
    const profileImage = data.photo[0];

    registerUser(data.email, data.password)
      .then(() => {
        const formData = new FormData();
        formData.append("image", profileImage);

        const Image_API_URL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;
        axios.post(Image_API_URL, formData).then((res) => {
          const photoURL = res.data.data.url;

          const userInfo = {
            name: data.name,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            profileImage: photoURL,
            packageLimit: 5,
            subscription: "basic",
          };

          axiosSecure.post("/register-employee", userInfo).then((res) => {
            if (res.data.insertedId) {
              console.log("User created in the database");
            }
          });

          const userProfile = {
            displayName: data.name,
            photoURL,
          };
          updateUserProfile(userProfile)
            .then(() => {
              console.log("User profile updated");
              navigate(location.state || "/");
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="lg:grid lg:grid-cols-2 min-h-screen bg-base-100">
      {/* Left: Employee Hero */}
      <div className="hidden lg:block ml-15">
        <EmployeeHero />
      </div>

      {/* Right: Registration Form */}
      <div className="flex items-center justify-center p-10 bg-base-100 shadow-2xl">
        <div className="w-full max-w-md">
          <h3 className="text-3xl font-bold text-primary text-center mb-2">
            Welcome to AssetVerse
          </h3>
          <p className="text-center text-base-content/70 mb-8">
            Register as Employee to manage your assets and stay connected
          </p>

          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="space-y-4"
          >
            {/* Photo */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Photo</span>
              </label>
              <input
                type="file"
                {...register("photo", { required: true })}
                className="file-input file-input-bordered w-full file-input-primary"
              />
              {errors.photo && (
                <span className="text-red-500 text-sm">Photo is required</span>
              )}
            </div>

            {/* Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Your Name"
                className="input input-bordered w-full input-primary"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Date of Birth</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="input input-bordered w-full input-accent"
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">
                  Date of Birth is required
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
                className="input input-bordered w-full input-primary"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                placeholder="Password"
                className="input input-bordered w-full input-secondary"
              />
              {errors.password?.type === "required" && (
                <span className="text-red-500 text-sm">
                  Password is required
                </span>
              )}
              {errors.password?.type === "minLength" && (
                <span className="text-red-500 text-sm">
                  Password must be at least 6 characters
                </span>
              )}
            </div>

            <button className="btn btn-primary w-full mt-4 hover:scale-105 transition-transform">
              Register
            </button>
             {/* Demo Buttons */}
  
            <button
              className="btn w-full bounce bg-red-500 px-6 cursor-pointer"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              Demo Employee Login
            </button>
            <dialog id="my_modal_4" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <Login></Login>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </form>

          <p className="text-center text-base-content/60 mt-6">
            Already have an account?{" "}
            <button
              className="px-6 cursor-pointer text-accent"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              Sign in
            </button>
            <dialog id="my_modal_4" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <Login></Login>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;
