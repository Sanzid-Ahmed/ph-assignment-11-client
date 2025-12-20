import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  FaUserAlt,
  FaEnvelope,
  FaIdBadge,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const EmployeeProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Keep existing image if user does not upload a new one
      let photoURL = user?.photoURL || user?.profileImage;

      // Upload only if a new image is selected
      if (data.photo && data.photo.length > 0) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imageAPI = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
        const imgRes = await axios.post(imageAPI, formData);

        photoURL = imgRes.data.data.url;
      }

      // Update database
      await axiosSecure.patch(`/users/update/${user?.email}`, {
        name: data.name,
        profileImage: photoURL,
      });

      // Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      toast.success("Profile updated successfully");

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { data: affiliations = [] } = useQuery({
    queryKey: ["employee-company", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/employee/company/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const companyName = affiliations?.[0]?.companyName;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">

        {/* LEFT CARD */}
        <div className="w-full md:w-1/3">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-32 h-32 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  <img
                    src={
                      user?.profileImage ||
                      user?.photoURL ||
                      "https://i.ibb.co/mR7093X/user-placeholder.png"
                    }
                    alt="Employee Avatar"
                    className="object-cover"
                  />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-black text-neutral">
                {user?.name || user?.displayName}
              </h2>
              <p className="text-xs font-bold opacity-50 tracking-widest uppercase">
                Employee Member
              </p>

              <div className="divider"></div>

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center justify-between bg-base-200/50 p-3 rounded-xl">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <FaIdBadge className="text-primary" /> Status
                  </span>
                  {companyName ? (
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
                  <span className="text-sm truncate opacity-80" title={user?.email}>
                    {user?.email}
                  </span>
                </div>
              </div>

              {companyName && (
                <div className="mt-6 p-4 bg-primary/10 rounded-2xl w-full border border-primary/20">
                  <p className="text-[10px] uppercase tracking-tighter font-black text-primary mb-1">
                    Affiliated Organization
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <FaBuilding className="text-primary" />
                    <p className="text-lg font-bold text-neutral">
                      {companyName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="w-full md:w-2/3">
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="bg-primary h-2"></div>
            <div className="card-body">
              <h3 className="text-xl font-black text-neutral mb-6 flex items-center gap-2">
                <FaUserAlt className="text-primary" /> Edit Personal Information
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* NAME */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered w-full ${
                        errors.name ? "border-error" : ""
                      }`}
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <span className="text-error text-xs mt-1">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold text-gray-400">
                        Email Address (Read-Only)
                      </span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">
                      Update Profile Photo (Optional)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-primary w-full"
                    {...register("photo")}
                  />
                </div>

                <div className="divider"></div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-12 rounded-xl shadow-lg shadow-primary/30"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {!companyName && (
            <div className="alert bg-amber-50 border border-amber-200 mt-6 shadow-sm">
              <FaTimesCircle className="text-amber-500 text-xl" />
              <div>
                <h3 className="font-bold text-amber-800 text-sm">
                  Affiliation Pending
                </h3>
                <p className="text-xs text-amber-700">
                  You won't see company assets until an HR Manager approves your request.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
