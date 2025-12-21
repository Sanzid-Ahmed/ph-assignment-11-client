import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaSearch, FaFilter, FaPaperPlane, FaBoxOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

const RequestAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Search, Filter & Pagination state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 6 assets per page

  // Modal state
  const [selectedAsset, setSelectedAsset] = useState(null);

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

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return assets.slice(start, start + itemsPerPage);
  }, [assets, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset pagination when filters change
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

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
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Request Assets</h2>
          <p className="text-slate-500 mt-2 font-medium">Equip yourself with the tools you need to succeed.</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            className="input input-bordered w-full pl-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="Search by asset name..."
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          />
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-white shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
          <FaFilter className="text-primary" /> FILTERS
        </div>

        <select
          className="select select-ghost select-sm font-bold text-slate-600 focus:bg-transparent"
          onChange={(e) => handleFilterChange(setFilterAvailability, e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Available">Available Only</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <div className="divider divider-horizontal mx-0 hidden md:flex"></div>

        <select
          className="select select-ghost select-sm font-bold text-slate-600 focus:bg-transparent"
          onChange={(e) => handleFilterChange(setFilterType, e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
          <div className="bg-slate-50 p-8 rounded-full mb-6">
            <FaBoxOpen className="text-6xl text-slate-200" />
          </div>
          <p className="text-2xl font-black text-slate-400">No assets found</p>
          <p className="text-slate-400 mt-2">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedAssets.map((asset) => (
              <div
                key={asset._id}
                className="group relative bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      asset.productQuantity > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {asset.productQuantity > 0 ? "In Stock" : "Unavailable"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-full">
                      {asset.productType}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-primary transition-colors">
                    {asset.productName}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                    Distributor: <span className="text-slate-600 underline decoration-primary/30">{asset.companyName}</span>
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quantity</span>
                      <span className="text-lg font-black text-slate-700">{asset.productQuantity} units</span>
                    </div>
                    
                    <button
                      disabled={asset.productQuantity <= 0}
                      onClick={() => {
                        setSelectedAsset(asset);
                        document.getElementById("request_modal").showModal();
                      }}
                      className="btn btn-primary rounded-2xl px-6 hover:scale-105 shadow-lg shadow-primary/25 disabled:bg-slate-100 disabled:text-slate-400 border-none"
                    >
                      Request <FaPaperPlane className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-12">
              <div className="join bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-ghost join-item rounded-xl disabled:text-slate-300"
                >
                  <FaChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`btn join-item rounded-xl w-12 border-none ${
                      currentPage === i + 1 ? "btn-primary text-white shadow-md shadow-primary/30" : "btn-ghost text-slate-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-ghost join-item rounded-xl disabled:text-slate-300"
                >
                  <FaChevronRight />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      <dialog id="request_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-[3rem] p-10 bg-white shadow-2xl">
          <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-6">
             <FaPaperPlane className="text-2xl text-primary" />
          </div>
          <h3 className="font-black text-3xl text-slate-800">Finalize Request</h3>
          <p className="py-4 text-slate-500 leading-relaxed">
            You are requesting <span className="text-primary font-bold">{selectedAsset?.productName}</span>. 
            HR will review your request shortly.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered h-32 rounded-[1.5rem] bg-slate-50 border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base"
                placeholder="Briefly explain why this asset is needed..."
                {...register("note", { required: true })}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("request_modal").close();
                  reset();
                }}
                className="btn btn-ghost flex-1 rounded-2xl font-bold text-slate-400"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-[2] rounded-2xl shadow-xl shadow-primary/30">
                Confirm & Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default RequestAsset;