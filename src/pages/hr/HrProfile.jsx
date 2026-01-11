import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  FaBuilding,
  FaEnvelope,
  FaGem,
  FaCamera,
  FaUsers,
  FaSave,
  FaUserAlt,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useUserData from "../../hooks/useUserData";

const HrProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const { userData } = useUserData();
  const { register, handleSubmit, reset, watch } = useForm();

  const selectedImage = watch("image");

  useEffect(() => {
    if (user) {
      reset({
        name: user?.displayName || user?.name || "",
        companyName: userData?.companyName || "",
      });
    }
  }, [user, userData, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let photoURL = user?.photoURL || user?.profileImage || "";

      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const imageAPI = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
        const imgRes = await axios.post(imageAPI, formData);
        photoURL = imgRes.data.data.url;
      }

      await axiosSecure.patch(`/users/update/${user?.email}`, {
        name: data.name,
        companyName: data.companyName,
        profileImage: photoURL,
      });

      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const { data: employees = [] } = useQuery({
    queryKey: ["employees", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/${user.email}`);
      return res.data || [];
    },
  });

  const employeeCount = employees.length;
  const packageLimit = userData?.packageLimit;
  const progressPercent = (employeeCount / packageLimit) * 100;

  return (
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-secondary tracking-tight">
            Account Settings
          </h2>
          <p className="text-gray-500">
            Manage your HR profile and company credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile & Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="card bg-base-100 shadow-xl border-t-4 border-primary overflow-hidden">
              <div className="card-body p-0">
                <div className="h-24 bg-primary/10 w-full flex items-end justify-center">
                  <div className="avatar -mb-12">
                    <div className="w-28 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 shadow-2xl bg-base-100">
                      <img
                        src={
                          user?.photoURL ||
                          user?.profileImage ||
                          "https://i.ibb.co/mJR9Qxc/user.png"
                        }
                        alt="Profile"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-2xl font-bold text-secondary">
                    {user?.displayName || user?.name}
                  </h3>
                  <div className="badge badge-primary badge-outline mt-1 font-semibold uppercase text-xs tracking-widest">
                    {user?.role || "HR"} Manager
                  </div>

                  <div className="divider my-4" />

                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="p-2 bg-base-200 rounded-lg">
                        <FaEnvelope className="text-primary" />
                      </div>
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="p-2 bg-base-200 rounded-lg">
                        <FaBuilding className="text-primary" />
                      </div>
                      <span>{userData?.companyName || "No Company Set"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="p-2 bg-base-200 rounded-lg">
                        <FaGem className="text-accent" />
                      </div>
                      <span className="font-bold">
                        {userData?.subscription || "Standard"} Tier
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Usage Card */}
            <div className="card bg-neutral text-neutral-content shadow-xl">
              <div className="card-body p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium opacity-70">Team Usage</span>
                  <FaUsers className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">
                  {employeeCount}{" "}
                  <span className="text-sm font-normal opacity-50">
                    / {packageLimit} Members
                  </span>
                </div>
                <progress
                  className={`progress w-full mt-2 ${
                    progressPercent > 80 ? "progress-error" : "progress-primary"
                  }`}
                  value={employeeCount}
                  max={packageLimit}
                ></progress>
                <p className="text-[10px] mt-2 opacity-40 uppercase tracking-tighter">
                  Your package allows up to {packageLimit} seats.
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-8">
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body p-6 md:p-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <h3 className="text-xl font-bold text-secondary">General Information</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="form-control w-full">
                      <label className="label font-bold">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="input input-bordered w-full focus:input-primary pl-10"
                          {...register("name", { required: true })}
                        />
                        <FaUserAlt className="absolute left-3 top-4 text-gray-300 text-sm" />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="form-control w-full">
                      <label className="label font-bold">
                        Company Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="input input-bordered w-full focus:input-primary pl-10"
                          {...register("companyName", { required: true })}
                        />
                        <FaBuilding className="absolute left-3 top-4 text-gray-300 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label font-bold opacity-50">
                      Email Address (Non-editable)
                    </label>
                    <input
                      value={user?.email || ""}
                      readOnly
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed text-gray-500"
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="form-control w-full">
                    <label className="label font-bold">Update Profile Picture</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-base-200 border-base-300 hover:bg-base-300 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {selectedImage?.length > 0 ? (
                            <p className="text-sm text-primary font-bold">
                              File Selected: {selectedImage[0].name}
                            </p>
                          ) : (
                            <>
                              <FaCamera className="text-2xl text-gray-400 mb-2" />
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                Click to upload new photo
                              </p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" {...register("image")} />
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="card-actions justify-end mt-4">
                    <button
                      disabled={loading}
                      className="btn btn-primary btn-block md:w-auto md:px-12 shadow-lg text-white flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <FaSave /> Save Profile
                        </>
                      )}
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
