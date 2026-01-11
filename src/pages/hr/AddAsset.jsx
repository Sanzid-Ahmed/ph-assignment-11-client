import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  FiTag, FiImage, FiLayers, FiHash, FiPlusCircle, 
  FiInfo, FiMapPin, FiFileText, FiBookmark 
} from "react-icons/fi";
import { motion } from "framer-motion";
console.log(motion)
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserData from "../../hooks/useUserData";

const AddAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserData();
  const companyName = userData?.companyName;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Live preview watchers
  const watchedName = watch("productName");
  const watchedImage = watch("productImage");
  const watchedType = watch("productType");
  const watchedQuantity = watch("productQuantity");

  const onSubmit = async (data) => {
    if (!user?.email || !companyName) {
      toast.error("User info not available. Please login again.");
      return;
    }

    const assetData = {
      productName: data.productName.trim(),
      productImage: data.productImage.trim(),
      productType: data.productType,
      productQuantity: Number(data.productQuantity),
      availableQuantity: Number(data.productQuantity),
      assetLocation: data.assetLocation,
      description: data.description,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
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
    <div className="min-h-screen p-4 md:p-8 bg-base-100">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary mb-4"
        >
          <FiPlusCircle size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Inventory Management</span>
        </motion.div>
        <h2 className="text-4xl font-extrabold text-base-content tracking-tight">Add New Asset</h2>
        <p className="text-base-content/60 mt-2">
          Register new equipment for <span className="text-primary font-semibold">{companyName || "your company"}</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-100 shadow-2xl rounded-[2rem] p-6 md:p-10 space-y-6 border border-base-300 relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Product Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Product Name</span>
                </label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-3 text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Dell Latitude Laptop"
                    className="input input-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    {...register("productName", { required: "Product name is required" })}
                  />
                </div>
                {errors.productName && <p className="text-error text-xs mt-1">{errors.productName.message}</p>}
              </div>

              {/* Product Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Product Image URL</span>
                </label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-3 text-secondary" size={18} />
                  <input
                    type="url"
                    placeholder="ImgBB / Cloudinary URL"
                    className="input input-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    {...register("productImage", { required: "Image URL is required" })}
                  />
                </div>
                {errors.productImage && <p className="text-error text-xs mt-1">{errors.productImage.message}</p>}
              </div>

              {/* Product Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Product Type</span>
                </label>
                <div className="relative">
                  <FiLayers className="absolute left-3 top-3 text-secondary" size={18} />
                  <select
                    className="select select-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    defaultValue=""
                    {...register("productType", { required: "Type is required" })}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                  </select>
                </div>
                {errors.productType && <p className="text-error text-xs mt-1">{errors.productType.message}</p>}
              </div>

              {/* Product Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Quantity</span>
                </label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-3 text-secondary" size={18} />
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 10"
                    className="input input-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    {...register("productQuantity", {
                      required: "Quantity is required",
                      min: { value: 1, message: "Min 1" },
                    })}
                  />
                </div>
                {errors.productQuantity && <p className="text-error text-xs mt-1">{errors.productQuantity.message}</p>}
              </div>

              {/* Asset Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Asset Location</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Floor 2, Room 205"
                    className="input input-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    {...register("assetLocation")}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Tags</span>
                </label>
                <div className="relative">
                  <FiBookmark className="absolute left-3 top-3 text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="Laptop, Office, IT"
                    className="input input-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50"
                    {...register("tags")}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-bold">Description</span>
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 text-secondary" size={18} />
                  <textarea
                    placeholder="Add any additional details about this asset..."
                    className="textarea textarea-bordered pl-10 w-full border-base-300 focus:border-primary bg-base-200/50 h-24"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="btn btn-primary w-full text-white shadow-lg shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Asset to Inventory"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Live Preview Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-200 rounded-[2rem] p-6 border border-base-300 shadow-sm"
          >
            <h3 className="text-sm font-bold opacity-50 uppercase mb-4 flex items-center gap-2">
              <FiImage /> Live Preview
            </h3>
            <div className="bg-base-100 rounded-2xl overflow-hidden border border-base-300 shadow-inner">
              <div className="h-44 bg-neutral flex items-center justify-center relative">
                {watchedImage ? (
                  <img src={watchedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-20">
                    <FiImage size={48} className="mx-auto mb-2" />
                    <p className="text-xs uppercase font-bold">No Image Provided</p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {watchedType && (
                    <span className={`badge badge-sm border-none font-bold py-3 px-3 shadow-lg ${
                      watchedType === "Returnable" ? "bg-primary text-white" : "bg-secondary text-white"
                    }`}>
                      {watchedType}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-extrabold text-lg truncate mb-3">
                  {watchedName || "Untitled Asset"}
                </h4>
                
                {watchedQuantity > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                      <span>Inventory Capacity</span>
                      <span>{watchedQuantity} Units</span>
                    </div>
                    <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] mt-4 opacity-50 italic text-center">Standard Listing Preview</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-6"
          >
            <h3 className="text-accent font-bold flex items-center gap-2 mb-3">
              <FiInfo /> Asset Guide
            </h3>
            <ul className="text-xs space-y-3 text-base-content/80">
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Returnable:</strong> Laptops, furniture, or tech equipment.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span><strong>Non-returnable:</strong> Stationery, snacks, or ink.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">•</span>
                <span>Separate <strong>tags</strong> with commas for better searchability.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;