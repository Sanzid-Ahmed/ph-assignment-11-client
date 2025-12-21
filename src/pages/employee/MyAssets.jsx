import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  FaSearch,
  FaFilePdf,
  FaUndoAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch Requests for the logged-in employee
  const {
    data: assets = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-assets", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${user?.email}`);
      return res.data;
    },
  });
  console.log(assets);

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
      title: "Print",
      text: "Print Done!",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#a966eb",
      cancelButtonColor: "#d33",
      confirmButtonText: `Print success ${asset.assetName} Receipt`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-neutral">My Assets</h2>
          <p className="text-gray-500 text-sm">
            Track and manage your requested company property.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="join border border-base-300">
            <input
              className="input input-bordered join-item input-sm md:input-md focus:outline-none"
              placeholder="Search Asset Name..."
            />
            <button className="btn join-item btn-primary btn-sm md:btn-md">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm">
        <select className="select select-bordered select-sm md:select-md grow md:grow-0">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <select className="select select-bordered select-sm md:select-md grow md:grow-0">
          <option value="">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr className="text-neutral uppercase text-xs tracking-wider">
                <th>Asset Name</th>
                <th>Type</th>
                <th>Request Date</th>
                <th>Approval Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <span className="loading loading-spinner text-primary"></span>
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    No assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr
                    key={asset._id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td className="font-bold text-neutral">
                      {asset.assetName}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${
                          asset.assetType === "Returnable"
                            ? "badge-ghost"
                            : "badge-outline"
                        }`}
                      >
                        {asset.assetType}
                      </span>
                    </td>
                    <td className="text-sm">
                      {new Date(asset.requestDate).toLocaleDateString()}
                    </td>
                    <td className="text-sm">
                      {asset.approvedAt
                        ? new Date(asset.approvedAt).toLocaleDateString()
                        : "---"}
                    </td>
                    <td>
                      {asset.isDirectAssignment ? (
                        <div className="flex items-center gap-2 font-bold text-xs uppercase text-blue-600">
                          Assigned
                        </div>
                      ) : asset.status === "pending" ? (
                        <div className="flex items-center gap-2 text-warning font-bold text-xs uppercase">
                          <FaClock /> {asset.requestStatus}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-success font-bold text-xs uppercase">
                          <FaCheckCircle /> {asset.requestStatus}
                        </div>
                      )}
                    </td>
                    <td className="text-right space-x-2">
                      {asset.requestStatus === "approved" && (
                        <button
                          onClick={() => handlePrint(asset)}
                          className="btn btn-square btn-ghost btn-sm text-primary tooltip"
                          data-tip="Download Receipt"
                        >
                          <FaFilePdf size={18} />
                        </button>
                      )}

                      {asset.requestStatus === "approved" &&
                        asset.assetType === "Returnable" && (
                          <button
                            onClick={() => handleReturn(asset._id)}
                            disabled={asset.returned}
                            className="btn btn-sm btn-outline btn-error rounded-lg"
                          >
                            <FaUndoAlt className="mr-1" /> Return
                          </button>
                        )}

                      {asset.requestStatus === "pending" && (
                        <button className="btn btn-sm btn-ghost btn-disabled opacity-50">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAssets;
