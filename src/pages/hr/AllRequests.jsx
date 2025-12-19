import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userData } = useUserData();
 

  // Fetch requests from server
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
    // 1️⃣ Check asset quantity
    const assetCheck = await axiosSecure.get(`/assets/${request.assetId}`);
    if (assetCheck.data.availableQuantity <= 0) {
      return toast.error("Out of stock! Cannot approve.");
    }

    // 2️⃣ Approve request
    const res = await axiosSecure.patch(`/requests/approve/${request._id}`, {
      assetId: request.assetId,
      employeeEmail: request.requesterEmail,
      employeeName: request.requesterName,
      hrEmail: user?.email,
      companyName: userData.companyName,
      companyLogo: userData.companyLogo
    });

    // CHANGE: Check for res.status === 200 or res.data.modifiedCount if your backend returns that
    if (res.status === 200 || res.data.success) {
      toast.success("Request Approved!");
      
      // Update local state
      setRequests((prev) =>
        prev.map((r) =>
          r._id === request._id ? { ...r, requestStatus: "approved" } : r
        )
      );
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Approval failed");
  }
};

// Reject a request
const handleReject = (id) => {
  Swal.fire({
    title: "Reject Request?",
    text: "Please confirm you want to reject this asset request.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, Reject",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/requests/reject/${id}`);
        
        // Ensure the condition matches your backend response
        if (res.status === 200 || res.data.success) {
          toast.success("Request Rejected");
          setRequests((prev) =>
            prev.map((r) =>
              r._id === id ? { ...r, requestStatus: "rejected" } : r
            )
          );
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reject request");
      }
    }
  });
};

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Asset Requests</h2>
        <div className="form-control">
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full md:w-80"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-primary-content">
            <tr>
              <th>Asset Info</th>
              <th>Requester</th>
              <th>Request Date</th>
              <th>Notes</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : requests.length > 0 ? (
              requests
                .filter((req) =>
                  req.requesterName.toLowerCase().includes(search.toLowerCase()) ||
                  req.requesterEmail.toLowerCase().includes(search.toLowerCase())
                )
                .map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div className="font-bold">{req.assetName}</div>
                      <div className="text-xs opacity-50">{req.assetType}</div>
                    </td>
                    <td>
                      <div className="font-medium">{req.requesterName}</div>
                      <div className="text-xs text-gray-500">{req.requesterEmail}</div>
                    </td>
                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td className="max-w-xs truncate">{req.note || "No notes"}</td>
                    <td>
                      <span className={`badge badge-sm ${
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
                            className="btn btn-success btn-xs text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="btn btn-error btn-xs text-white"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;
