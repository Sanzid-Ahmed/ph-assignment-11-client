import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [user?.email, search]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/requests/hr?email=${user?.email}&search=${search}`);
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      // 1. Check if asset still has quantity (safety check)
      const assetCheck = await axiosSecure.get(`/assets/${request.assetId}`);
      if (assetCheck.data.availableQuantity <= 0) {
        return toast.error("Out of stock! Cannot approve.");
      }

      // 2. Perform approval
      // Backend should: Update request status, decrease asset availableQuantity, 
      // check/create affiliation, and add to assignedAssets collection.
      const res = await axiosSecure.patch(`/requests/approve/${request._id}`, {
        assetId: request.assetId,
        employeeEmail: request.requesterEmail,
        employeeName: request.requesterName,
        hrEmail: user?.email,
        companyName: user?.companyName,
        companyLogo: user?.companyLogo
      });

      if (res.data.modifiedCount > 0 || res.data.success) {
        toast.success("Request Approved and Asset Assigned!");
        fetchRequests();
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
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/requests/reject/${id}`);
          toast.success("Request Rejected");
          fetchRequests();
        } catch (error) {
          toast.error("Failed to reject request", error);
        }
      }
    });
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
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
              <tr><td colSpan="6" className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
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
                      req.requestStatus === 'pending' ? 'badge-warning' : 
                      req.requestStatus === 'approved' ? 'badge-success' : 'badge-error'
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
              <tr><td colSpan="6" className="text-center py-10">No pending requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;