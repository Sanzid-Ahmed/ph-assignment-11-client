import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiTag, FiImage, FiLayers, FiHash } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserData from "../../hooks/useUserData";

const AddAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserData();
  const { companyName } = userData;
  


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user?.email || companyName ) {
      toast.error("User info not available. Please login again.");
      return;
    }

    const assetData = {
      productName: data.productName.trim(),
      productImage: data.productImage.trim(),
      productType: data.productType,
      productQuantity: Number(data.productQuantity),
      availableQuantity: Number(data.productQuantity),
      hrEmail: user.email,
      companyName: companyName,
      dateAdded: new Date(),
    };

    try {
      await axiosSecure.post("/assets", assetData);
      toast.success("Asset added successfully!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add asset");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Add New Asset</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Product Name</span>
            </label>
            <div className="relative">
              <FiTag className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="e.g. Dell Latitude Laptop"
                className="input input-bordered pl-10 w-full"
                {...register("productName", { required: "Product name is required" })}
              />
            </div>
            {errors.productName && <p className="text-error mt-1">{errors.productName.message}</p>}
          </div>

          {/* Product Image */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Product Image URL</span>
            </label>
            <div className="relative">
              <FiImage className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="url"
                placeholder="ImgBB / Cloudinary URL"
                className="input input-bordered pl-10 w-full"
                {...register("productImage", { required: "Product image URL is required" })}
              />
            </div>
            {watch("productImage") && (
              <img src={watch("productImage")} alt="Preview" className="h-24 mt-2 rounded-lg object-cover" />
            )}
            {errors.productImage && <p className="text-error mt-1">{errors.productImage.message}</p>}
          </div>

          {/* Product Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Product Type</span>
            </label>
            <div className="relative">
              <FiLayers className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                className="select select-bordered pl-10 w-full"
                defaultValue=""
                {...register("productType", { required: "Product type is required" })}
              >
                <option value="">Select type</option>
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>
            {errors.productType && <p className="text-error mt-1">{errors.productType.message}</p>}
          </div>

          {/* Product Quantity */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Product Quantity</span>
            </label>
            <div className="relative">
              <FiHash className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                min="1"
                placeholder="e.g. 10"
                className="input input-bordered pl-10 w-full"
                {...register("productQuantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" },
                })}
              />
            </div>
            {errors.productQuantity && <p className="text-error mt-1">{errors.productQuantity.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary w-full text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Asset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAsset;
