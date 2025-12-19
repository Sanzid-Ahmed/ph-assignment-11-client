import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const AssetList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update Modal State
  const [editingAsset, setEditingAsset] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "",
    productType: "Returnable",
    productQuantity: 1,
    productImage: "",
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssets();
  }, [user?.email, search, filter, sort, currentPage]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/assets/hr/${user?.email}`);
      setAssets(res.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/assets/${id}`);
          toast.success("Asset deleted successfully");
          fetchAssets();
        } catch (error) {
          toast.error("Failed to delete asset", error);
        }
      }
    });
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setEditForm({
      productName: asset.productName,
      productType: asset.productType,
      productQuantity: asset.productQuantity,
      productImage: asset.productImage,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.put(`/assets/${editingAsset._id}`, {
        ...editForm,
        availableQuantity: editForm.productQuantity, // update available as needed
      });
      toast.success("Asset updated successfully");
      setEditingAsset(null);
      fetchAssets();
    } catch (error) {
      toast.error("Failed to update asset", error);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-neutral">Company Asset Inventory</h2>
        
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              className="input input-bordered pl-10 w-full max-w-xs"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
          </div>

          <select className="select select-bordered" onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>

          <button className={`btn btn-outline ${sort ? "btn-primary" : ""}`} onClick={() => setSort(!sort)}>
            <FaSortAmountDown /> Sort by Qty
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto rounded-lg border border-base-200 shadow-sm">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
            ) : assets.length > 0 ? (
              assets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={asset.productImage} alt={asset.productName} />
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-neutral">{asset.productName}</td>
                  <td>
                    <span className={` badge badge-sm ${asset.productType === "Returnable" ? "badge-info bg-primary border-0 text-white" : "badge-ghost"}`}>
                      {asset.productType}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span>Total: {asset.productQuantity}</span>
                      <span className="text-xs text-gray-500">Available: {asset.availableQuantity}</span>
                    </div>
                  </td>
                  <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                  <td className="flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(asset)}
                      className="btn btn-ghost btn-sm text-info"
                    >
                      <FaEdit size={18} className="text-secondary"/>
                    </button>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">
                  No assets found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Update Asset</h3>
            <input
              type="text"
              name="productName"
              value={editForm.productName}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="productQuantity"
              value={editForm.productQuantity}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-3"
              placeholder="Quantity"
            />
            <select
              name="productType"
              value={editForm.productType}
              onChange={handleEditChange}
              className="select select-bordered w-full mb-3"
            >
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
            <input
              type="url"
              name="productImage"
              value={editForm.productImage}
              onChange={handleEditChange}
              className="input input-bordered w-full mb-4"
              placeholder="Image URL"
            />
            <div className="flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setEditingAsset(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <div className="join border border-base-300">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="join-item btn btn-sm bg-base-100"
          >
            «
          </button>
          <button className="join-item btn btn-sm bg-base-200">Page {currentPage}</button>
          <button 
            disabled={assets.length < itemsPerPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="join-item btn btn-sm bg-base-100"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetList;
