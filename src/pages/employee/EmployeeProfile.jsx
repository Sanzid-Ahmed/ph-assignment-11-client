import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import { FaUserAlt, FaEnvelope, FaCamera, FaIdBadge, FaCheckCircle, FaTimesCircle, FaBuilding } from "react-icons/fa";

const img_hosting_key = import.meta.env.VITE_IMGBB_API_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;

const EmployeeProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let imageUrl = user?.profileImage || user?.photoURL;

    try {
      // 1. Upload new image if selected
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
        profileImage: imageUrl,
      };

      const response = await axiosSecure.patch(`/users/update/${user?.email}`, updatedInfo);

      if (response.data.modifiedCount > 0 || response.data.upsertedCount > 0) {
        // 3. Update Firebase/Context Local State
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

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Card: Summary & Affiliation */}
        <div className="w-full md:w-1/3">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-32 h-32 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={user?.profileImage || user?.photoURL || "https://i.ibb.co.com/mR7093X/user-placeholder.png"} 
                    alt="Employee Avatar" 
                  />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-black text-neutral">{user?.name || user?.displayName}</h2>
              <p className="text-xs font-bold opacity-50 tracking-widest uppercase">Employee Member</p>

              <div className="divider"></div>

              {/* Status Section */}
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center justify-between bg-base-200/50 p-3 rounded-xl">
                  <span className="text-sm font-bold flex items-center gap-2"><FaIdBadge className="text-primary"/> Status</span>
                  {user?.companyName ? (
                    <span className="badge badge-success badge-sm gap-1 text-white font-bold p-3">
                      <FaCheckCircle /> Affiliated
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm gap-1 text-white font-bold p-3">
                      <FaTimesCircle /> Not Affiliated
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 px-2">
                   <FaEnvelope className="text-primary opacity-70" />
                   <span className="text-sm truncate opacity-80">{user?.email}</span>
                </div>
              </div>
              
              {user?.companyName && (
                <div className="mt-6 p-4 bg-primary/10 rounded-2xl w-full border border-primary/20">
                  <p className="text-[10px] uppercase tracking-tighter font-black text-primary mb-1">Affiliated Organization</p>
                  <div className="flex items-center justify-center gap-2">
                    <FaBuilding className="text-primary" />
                    <p className="text-lg font-bold text-neutral">{user.companyName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Account Settings */}
        <div className="w-full md:w-2/3">
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="bg-primary p-1"></div> {/* Top accent bar */}
            <div className="card-body">
              <h3 className="text-xl font-black text-neutral mb-6 flex items-center gap-2">
                <FaUserAlt className="text-primary" /> Edit Personal Information
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered w-full focus:border-primary font-medium"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>

                  {/* Email Input (Disabled - Unique Identifier) */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold text-gray-400">Email Address (Read-Only)</span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Update Profile Photo</span>
                  </label>
                  <div className="flex items-center gap-4 w-full">
                     <input
                        type="file"
                        className="file-input file-input-bordered file-input-primary grow"
                        {...register("image")}
                      />
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`btn btn-primary px-12 rounded-xl shadow-lg shadow-primary/30 ${loading ? 'loading' : ''}`}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Affiliation Notice */}
          {!user?.companyName && (
            <div className="alert bg-amber-50 border border-amber-200 mt-6 shadow-sm">
              <FaTimesCircle className="text-amber-500 text-xl" />
              <div>
                <h3 className="font-bold text-amber-800">Affiliation Pending</h3>
                <div className="text-xs text-amber-700">You won't see company assets until an HR Manager approves your first request.</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;