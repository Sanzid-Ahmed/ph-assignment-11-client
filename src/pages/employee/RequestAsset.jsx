import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaSearch, FaFilter, FaPaperPlane, FaBoxOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";

const RequestAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  // Modal state
  const [selectedAsset, setSelectedAsset] = useState(null);

  // react-hook-form setup
  const { register, handleSubmit, reset } = useForm();

  // Fetch all available assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["available-assets", search, filterType, filterAvailability],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets", {
        params: { search, type: filterType, availability: filterAvailability },
      });
      return res.data;
    },
  });

  // Submit asset request
  const onSubmit = async (data) => {
    if (!selectedAsset) return;

    const requestData = {
      assetId: selectedAsset._id,
      assetName: selectedAsset.productName,
      assetType: selectedAsset.productType,
      requesterEmail: user?.email,
      requesterName: user?.displayName || user?.name,
      hrEmail: selectedAsset.hrEmail,
      companyName: selectedAsset.companyName,
      requestDate: new Date().toISOString(),
      note: data.note,
      requestStatus: "pending",
    };

    try {
      const res = await axiosSecure.post("/requests", requestData);
      if (res.data.insertedId) {
        toast.success(`Request for ${selectedAsset.productName} submitted!`);
        document.getElementById("request_modal").close();
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-neutral">Request an Asset</h2>
          <p className="text-gray-500">Browse and request items from all company inventories.</p>
        </div>

        {/* Search Bar */}
        <div className="join w-full lg:w-96 shadow-sm">
          <input
            className="input input-bordered join-item w-full focus:outline-none"
            placeholder="Search assets..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn join-item btn-primary">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-base-100 p-5 rounded-3xl border border-base-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mr-2">
          <FaFilter className="text-primary" /> Filter By:
        </div>

        <select
          className="select select-bordered select-sm md:select-md"
          onChange={(e) => setFilterAvailability(e.target.value)}
        >
          <option value="">Availability</option>
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select
          className="select select-bordered select-sm md:select-md"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Asset Type</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-base-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 bg-base-200/50 rounded-[3rem] border-2 border-dashed border-base-300">
          <FaBoxOpen className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-400">No assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset._id}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden group"
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-neutral group-hover:text-primary transition-colors">
                    {asset.productName}
                  </h3>
                  <div
                    className={`badge ${
                      asset.productQuantity > 0 ? "badge-success" : "badge-error"
                    } badge-sm text-white font-bold`}
                  >
                    {asset.productQuantity > 0 ? "Available" : "Out of Stock"}
                  </div>
                </div>

                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">
                  {asset.productType} - {asset.companyName}
                </p>

                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-sm font-medium text-gray-500">
                    Stock: <span className="text-neutral font-bold">{asset.productQuantity}</span>
                  </span>
                  <button
                    disabled={asset.productQuantity <= 0}
                    onClick={() => {
                      setSelectedAsset(asset);
                      document.getElementById("request_modal").showModal();
                    }}
                    className="btn btn-primary btn-sm rounded-xl gap-2 shadow-lg shadow-primary/20"
                  >
                    Request <FaPaperPlane className="text-[10px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <dialog id="request_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-[2rem] p-8">
          <h3 className="font-black text-2xl text-neutral">Request Details</h3>
          <p className="py-4 text-gray-500">
            You are requesting <span className="text-primary font-bold">{selectedAsset?.productName}</span> from{" "}
            {selectedAsset?.companyName}. Please provide any additional notes for the HR.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Additional Notes</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 rounded-2xl focus:border-primary"
                placeholder="Why do you need this asset?"
                {...register("note", { required: true })}
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("request_modal").close();
                  reset();
                }}
                className="btn btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary rounded-xl px-8">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default RequestAsset;
