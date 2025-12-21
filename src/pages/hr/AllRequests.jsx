import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserData();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/requests/${user?.email}`);
      setRequests(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user?.email]);

  /* ================= FILTERING & PAGINATION LOGIC ================= */
  const filteredRequests = useMemo(() => {
    return requests.filter((req) =>
      req.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      req.requesterEmail.toLowerCase().includes(search.toLowerCase())
    );
  }, [requests, search]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  /* ================= ACTIONS ================= */
  const handleApprove = async (request) => {
    try {
      const assetCheck = await axiosSecure.get(`/assets/${request.assetId}`);
      if (assetCheck.data.availableQuantity <= 0) {
        return toast.error("Out of stock! Cannot approve.");
      }

      const res = await axiosSecure.patch(`/requests/approve/${request._id}`, {
        assetId: request.assetId,
        employeeEmail: request.requesterEmail,
        employeeName: request.requesterName,
        hrEmail: user?.email,
        companyName: userData.companyName,
        companyLogo: userData.companyLogo
      });

      if (res.status === 200 || res.data.success) {
        toast.success("Request Approved!");
        setRequests((prev) =>
          prev.map((r) => (r._id === request._id ? { ...r, requestStatus: "approved" } : r))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Request?",
      text: "This action will notify the employee.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/requests/reject/${id}`);
          if (res.status === 200 || res.data.success) {
            toast.success("Request Rejected");
            setRequests((prev) =>
              prev.map((r) => (r._id === id ? { ...r, requestStatus: "rejected" } : r))
            );
          }
        } catch (error) {
          toast.error("Failed to reject request", error);
        }
      }
    });
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
  const hasAccess = employeeCount < (userData?.packageLimit || 0);

  return (
    <div className="p-4 md:p-8 bg-[#f9fafb] min-h-screen">
      {hasAccess ? (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-3xl font-black text-gray-800">Pending Requests</h2>
              <p className="text-gray-500 mt-1">Review and manage asset distributions</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow lg:flex-grow-0">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requester..."
                  className="input input-bordered w-full lg:w-72 pl-10 bg-gray-50 border-gray-200"
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <select 
                className="select select-bordered bg-gray-50"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value="5">5 / page</option>
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Asset Information</th>
                    <th>Requested By</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th className="text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-24">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                      </td>
                    </tr>
                  ) : paginatedRequests.length > 0 ? (
                    paginatedRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-800">{req.assetName}</div>
                          <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md inline-block mt-1 uppercase">
                            {req.assetType}
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-gray-700">{req.requesterName}</div>
                          <div className="text-xs text-gray-400 font-medium">{req.requesterEmail}</div>
                        </td>
                        <td className="text-gray-500 text-sm">
                          {new Date(req.requestDate).toLocaleDateString('en-US', {
                             month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="max-w-[180px]">
                          <p className="text-xs italic text-gray-400 line-clamp-2" title={req.note}>
                            {req.note || "No specific notes..."}
                          </p>
                        </td>
                        <td>
                          <div className={`badge badge-sm font-bold border-none px-3 py-2.5 ${
                            req.requestStatus === "pending" ? "bg-amber-100 text-amber-700" :
                            req.requestStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                            "bg-rose-100 text-rose-700"
                          }`}>
                            {req.requestStatus.toUpperCase()}
                          </div>
                        </td>
                        <td className="text-center">
                          {req.requestStatus === "pending" ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleApprove(req)}
                                className="btn btn-sm btn-success text-white shadow-sm hover:scale-105 transition-transform"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req._id)}
                                className="btn btn-sm btn-ghost text-rose-500 hover:bg-rose-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-20">
                        <div className="flex flex-col items-center opacity-40">
                          <FiAlertCircle size={48} className="mb-2" />
                          <p className="font-bold">No matching requests found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            {!loading && totalPages > 1 && (
              <div className="p-5 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-gray-50/30 gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="join bg-white border border-gray-200">
                  <button 
                    className="join-item btn btn-sm px-4" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <FiChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`join-item btn btn-sm px-4 ${currentPage === i + 1 ? 'btn-primary text-white' : 'btn-ghost'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="join-item btn btn-sm px-4" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Package Limit UI */
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="card w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            <div className="h-2 bg-primary"></div>
            <div className="card-body items-center text-center p-10">
              <div className="bg-primary/10 p-5 rounded-full mb-4 animate-bounce">
                <FiTrendingUp className="size-12 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-gray-800">Growth Required!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                You've hit your staff limit of <span className="font-bold text-gray-800">{userData.packageLimit}</span>. 
                Upgrade now to process more requests and empower your growing team.
              </p>
              <div className="card-actions mt-8 w-full flex flex-col gap-3">
                <Link to="/dashboard/upgrade" className="btn btn-primary w-full text-white shadow-lg shadow-primary/30">
                  Upgrade My Package
                </Link>
                <Link to="/dashboard/home" className="btn btn-ghost text-gray-400 btn-sm">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRequests;