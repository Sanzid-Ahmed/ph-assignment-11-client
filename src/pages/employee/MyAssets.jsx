import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useState, useMemo } from "react";
import {
  FaSearch,
  FaFilePdf,
  FaUndoAlt,
  FaClock,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
  FaFilter,
  FaUserCheck,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetching Data
  const { data: assets = [], refetch, isLoading } = useQuery({
    queryKey: ["my-assets", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${user?.email}`);
      return res.data;
    },
  });

  /* ================= FILTER & PAGINATION LOGIC ================= */
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.assetName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? asset.requestStatus === statusFilter : true;
      const matchesType = typeFilter ? asset.assetType === typeFilter : true;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assets, search, statusFilter, typeFilter]);

  // Reset to page 1 when filters change
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAssets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAssets, currentPage]);

  /* ================= HANDLERS ================= */
  const handleReturn = async (id) => {
    Swal.fire({
      title: "Return Asset?",
      text: "Are you sure you want to return this item to inventory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/requests/return/${id}`);
          if (res.data.modifiedCount > 0) {
            toast.success("Asset returned successfully");
            refetch();
          }
        } catch (error) {
          toast.error("Failed to return asset", error);
        }
      }
    });
  };

  const handlePrint = (asset) => {
    Swal.fire({
      title: "Generating Receipt...",
      text: `PDF format for ${asset.assetName} is being prepared.`,
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
    // In a real app, you'd trigger your PDF generation library here
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-neutral tracking-tight">My Assets</h2>
          <p className="text-gray-500 font-medium mt-1">Manage and track your assigned company equipment.</p>
        </div>

        <div className="join shadow-sm border border-base-300 w-full md:w-auto">
          <div className="flex items-center bg-white px-4">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            className="input join-item w-full md:w-64 focus:outline-none pl-2"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-60 px-2">
          <FaFilter /> Filters
        </div>
        
        <select 
          className="select select-sm select-bordered rounded-lg font-semibold"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <select 
          className="select select-sm select-bordered rounded-lg font-semibold"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="">All Asset Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>

        {(search || statusFilter || typeFilter) && (
            <button 
                onClick={() => {setSearch(""); setStatusFilter(""); setTypeFilter(""); setCurrentPage(1);}}
                className="btn btn-sm btn-ghost text-error font-bold"
            >
                Clear All
            </button>
        )}
      </div>

      {/* Table Content */}
      <div className="bg-base-100 shadow-xl border border-base-200 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50">
              <tr className="text-neutral uppercase text-xs font-bold tracking-widest">
                <th className="py-5 px-8">Asset Details</th>
                <th>Type</th>
                <th>Requested</th>
                <th>Approved</th>
                <th>Status</th>
                <th className="text-right px-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                  </td>
                </tr>
              ) : paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <FaInbox size={64} />
                      <p className="text-2xl font-black mt-4">No Assets Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => (
                  <tr key={asset._id} className="hover:bg-base-200/30 transition-all group">
                    <td className="py-5 px-8">
                      <div className="font-bold text-neutral group-hover:text-primary transition-colors">
                        {asset.assetName}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm font-bold ${asset.assetType === "Returnable" ? "badge-neutral" : "badge-outline opacity-60"}`}>
                        {asset.assetType}
                      </span>
                    </td>
                    <td className="text-sm font-medium opacity-70">
                      {new Date(asset.requestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="text-sm font-medium opacity-70">
                      {asset.approvedAt ? new Date(asset.approvedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                    </td>
                    
                    {/* ENHANCED STATUS LOGIC */}
                    <td>
                      {asset.isDirectAssignment ? (
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
                          <FaUserCheck /> Assigned
                        </div>
                      ) : asset.requestStatus === "pending" ? (
                        <div className="flex items-center gap-2 text-warning font-black text-[10px] uppercase bg-warning/10 px-3 py-1 rounded-full w-fit border border-warning/20">
                          <FaClock /> Pending
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase bg-success/10 px-3 py-1 rounded-full w-fit border border-success/20">
                          <FaCheckCircle /> Approved
                        </div>
                      )}
                    </td>

                    <td className="text-right space-x-2 px-8">
                      {asset.requestStatus === "approved" && (
                        <button
                          onClick={() => handlePrint(asset)}
                          className="btn btn-circle btn-ghost btn-sm text-primary tooltip"
                          data-tip="Download PDF"
                        >
                          <FaFilePdf size={18} />
                        </button>
                      )}

                      {asset.requestStatus === "approved" && asset.assetType === "Returnable" && (
                        <button
                          onClick={() => handleReturn(asset._id)}
                          disabled={asset.returned}
                          className={`btn btn-sm rounded-xl font-bold px-4 transition-all ${
                            asset.returned 
                            ? 'btn-disabled bg-base-300' 
                            : 'btn-outline btn-error hover:scale-105'
                          }`}
                        >
                          <FaUndoAlt className={`mr-1 ${asset.returned ? 'hidden' : 'block'}`} /> 
                          {asset.returned ? 'Already Returned' : 'Return Asset'}
                        </button>
                      )}

                      {asset.requestStatus === "pending" && (
                        <button className="btn btn-sm btn-ghost lowercase font-normal opacity-40 italic cursor-not-allowed">
                          waiting for approval...
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-base-200/30 gap-4 border-t border-base-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Showing <span className="text-neutral">{paginatedAssets.length}</span> of {filteredAssets.length} Assets
            </span>
            <div className="join bg-white shadow-sm border border-base-300">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-sm px-4 disabled:bg-base-200"
              >
                <FaChevronLeft size={10} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`join-item btn btn-sm px-4 font-bold ${currentPage === i + 1 ? 'btn-primary text-white' : 'btn-ghost'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="join-item btn btn-sm px-4 disabled:bg-base-200"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssets;