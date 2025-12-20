import React, { useEffect, useState } from "react";
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
import useUserData from "../../hooks/useUserData";

const HrProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const { userData } = useUserData();

  const { register, handleSubmit, reset } = useForm();

  /* ✅ Reset form when user loads */
  useEffect(() => {
    if (user) {
      reset({
        name: user?.displayName || user?.name || "",
        companyName: user?.companyName || "",
      });
    }
  }, [user, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let photoURL = user?.photoURL || user?.profileImage || "";

      /* ✅ IMAGE UPLOAD (FIXED) */
      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const imageAPI = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;

        const imgRes = await axios.post(imageAPI, formData);
        photoURL = imgRes.data.data.url;
      }

      /* ✅ UPDATE DB */
      await axiosSecure.patch(`/users/update/${user?.email}`, {
        name: data.name,
        companyName: data.companyName,
        profileImage: photoURL,
      });

      /* ✅ UPDATE FIREBASE */
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

  /* ================= EMPLOYEES ================= */
  const { data: employees = [] } = useQuery({
    queryKey: ["employees", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/employees/${user.email}`);
      return res.data || [];
    },
  });

  const employeeCount = employees.length;

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}
          <div>
            <div className="card shadow border">
              <div className="card-body items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-32 rounded-full ring ring-primary">
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

                <div className="badge badge-primary">
                  {user?.role} Manager
                </div>

                <div className="divider" />

                <div className="space-y-2 text-left text-sm w-full">
                  <p className="flex gap-2 items-center">
                    <FaEnvelope /> {user?.email}
                  </p>
                  <p className="flex gap-2 items-center">
                    <FaBuilding /> {userData?.companyName || "Not Set"}
                  </p>
                  <p className="flex gap-2 items-center">
                    <FaGem className="text-warning" />{" "}
                    {user?.subscription || "Basic"}
                  </p>
                </div>
              </div>
            </div>

            <div className="stats shadow mt-6 bg-neutral text-neutral-content">
              <div className="stat">
                <div className="stat-title">Employees</div>
                <div className="stat-value text-2xl">
                  {employeeCount} / {userData?.packageLimit || 5}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-2">
            <div className="card shadow border">
              <div className="card-body">
                <h3 className="card-title">Edit Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Full Name"
                    {...register("name", { required: true })}
                  />

                  <input
                    className="input input-bordered w-full"
                    placeholder="Company Name"
                    {...register("companyName", { required: true })}
                  />

                  <input
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full bg-base-200"
                  />

                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    {...register("image")}
                  />

                  <button
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
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
