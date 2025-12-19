import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  FaBuilding,
  FaUserAlt,
  FaEnvelope,
  FaGem,
  FaUpload,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const img_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const HrProfile = () => {
  const { user, updateUserProfile } = useAuth(); // Assuming your AuthProvider has an update function
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name,
      companyName: user?.companyName,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let imageUrl = user?.profileImage || user?.photoURL;

    try {
      // 1. If a new image is selected, upload to ImgBB
      if (data.image[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const res = await axios.post(img_hosting_api, formData);
        if (res.data.success) {
          imageUrl = res.data.data.display_url;
        }
      }

      // 2. Update Backend
      const updatedInfo = {
        name: data.name,
        companyName: data.companyName,
        profileImage: imageUrl,
      };

      const response = await axiosSecure.patch(
        `/users/update/${user?.email}`,
        updatedInfo
      );

      if (response.data.modifiedCount > 0) {
        // 3. Update Firebase/Context state so the UI reflects changes immediately
        if (updateUserProfile) {
          await updateUserProfile(data.name, imageUrl);
        }
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const { data: employees = [] } = useQuery({
    queryKey: ["employees", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/${user.email}`);
      return res.data;
    },
  });

  const number = employees.length;

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-neutral">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user?.profileImage ||
                        user?.photoURL ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold">
                  {user?.name || user?.displayName}
                </h3>
                <div className="badge badge-primary uppercase font-bold text-xs">
                  {user?.role} Manager
                </div>

                <div className="divider"></div>

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <FaEnvelope className="text-primary" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaBuilding className="text-primary" />
                    <span>{user?.companyName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaGem className="text-warning" />
                    <span className="font-semibold">
                      Plan: {user?.subscription || "Basic"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Stats Card */}
            <div className="stats stats-vertical shadow w-full mt-6 bg-neutral text-neutral-content">
              <div className="stat">
                <div className="stat-title text-neutral-content opacity-70">
                  Employee Limit
                </div>
                <div className="stat-value text-2xl">
                  {number || 0} / {user?.packageLimit || 5}
                </div>
                <div className="stat-desc text-neutral-content opacity-70">
                  Based on your plan
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Update Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h3 className="card-title mb-6">Edit Profile Information</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Full Name
                      </span>
                    </label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-4 top-4 text-gray-400" />
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10"
                        {...register("name", { required: "Name is required" })}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Company Name
                      </span>
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-4 top-4 text-gray-400" />
                      <input
                        type="text"
                        className="input input-bordered w-full pl-10"
                        {...register("companyName", {
                          required: "Company Name is required",
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Email Address (Read-Only)
                      </span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Change Profile Picture
                      </span>
                    </label>
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full"
                      {...register("image")}
                    />
                  </div>

                  <div className="form-control mt-8">
                    <button
                      type="submit"
                      className={`btn btn-primary gap-2 ${
                        loading ? "loading" : ""
                      }`}
                      disabled={loading}
                    >
                      {!loading && <FaUpload />}
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrProfile;
