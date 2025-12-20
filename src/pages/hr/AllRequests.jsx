import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiAlertCircle, FiSearch } from "react-icons/fi";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userData } = useUserData();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/requests/${user?.email}`);
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user?.email]);

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
      text: "Please confirm you want to reject this asset request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
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
          toast.error(error.response?.data?.message || "Failed to reject request");
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
    <div className="p-4 md:p-8 bg-base-200 min-h-screen">
      {hasAccess ? (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Asset Requests</h2>
              <p className="text-gray-500 text-sm">Manage and track employee asset applications</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
              <table className="table table-md w-full table-zebra">
                <thead className="bg-base-200">
                  <tr className="text-base">
                    <th>Asset Details</th>
                    <th>Requester</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-20">
                        <span className="loading loading-dots loading-lg text-primary"></span>
                      </td>
                    </tr>
                  ) : requests.length > 0 ? (
                    requests
                      .filter((req) =>
                        req.requesterName.toLowerCase().includes(search.toLowerCase()) ||
                        req.requesterEmail.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((req) => (
                        <tr key={req._id} className="hover">
                          <td>
                            <div className="font-bold text-primary">{req.assetName}</div>
                            <div className="badge badge-ghost badge-sm font-medium">{req.assetType}</div>
                          </td>
                          <td>
                            <div className="font-medium">{req.requesterName}</div>
                            <div className="text-xs text-gray-400">{req.requesterEmail}</div>
                          </td>
                          <td className="whitespace-nowrap">
                            {new Date(req.requestDate).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </td>
                          <td className="max-w-[200px]">
                            <p className="truncate italic text-gray-500" title={req.note}>
                                {req.note || "No notes provided"}
                            </p>
                          </td>
                          <td>
                            <span className={`badge badge-md font-semibold px-4 ${
                              req.requestStatus === "pending" ? "badge-warning" :
                              req.requestStatus === "approved" ? "badge-success" :
                              "badge-error"
                            }`}>
                              {req.requestStatus}
                            </span>
                          </td>
                          <td className="text-center">
                            {req.requestStatus === "pending" ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleApprove(req)}
                                  className="btn btn-success btn-sm text-white px-4"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(req._id)}
                                  className="btn btn-outline btn-error btn-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-xs uppercase font-bold tracking-widest text-gray-300">Completed</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-20">
                        <div className="flex flex-col items-center gap-2">
                           <FiAlertCircle className="size-10 text-gray-300" />
                           <p className="text-gray-500 font-medium">No pending requests found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Upgrade Package UI - Clean Centered Hero */
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="card w-full max-w-md bg-base-100 shadow-2xl border-t-4 border-primary">
            <div className="card-body items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FiTrendingUp className="size-12 text-primary" />
              </div>
              <h2 className="card-title text-2xl font-bold">Package Limit Reached!</h2>
              <p className="text-gray-500">
                You have reached your employee limit of <span className="font-bold text-black">{userData.packageLimit}</span>. 
                Upgrade your subscription to accept more requests and grow your team.
              </p>
              <div className="card-actions mt-6 w-full">
                <Link to="/dashboard/upgrade" className="btn btn-primary w-full shadow-lg">
                  <FiTrendingUp className="mr-2" /> Upgrade Package Now
                </Link>
                <Link to="/dashboard/home" className="btn btn-ghost w-full btn-sm mt-2">
                  Back to Overview
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