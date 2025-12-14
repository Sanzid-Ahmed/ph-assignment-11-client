import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AddAssetForm = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The onSubmit function must be async
  const onSubmit = async (assetData) => {
    setIsSubmitting(true);

    try {
      const res = await axiosSecure.post("/api/v1/assets", assetData);

      if (res.data.insertedId) {
        toast.success("Asset added successfully!");
        reset();
      } else {
        toast.error("Failed to add asset.");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">Asset Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("name", { required: true })}
        />
      </div>

      <div className="form-control">
        <label className="label">Quantity</label>
        <input
          type="number"
          className="input input-bordered w-full"
          {...register("quantity", { required: true, min: 1 })}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Add Asset"}
      </button>
    </form>
  );
};

export default AddAssetForm;
