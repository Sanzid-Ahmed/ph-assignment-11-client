import React, { useEffect, useState, useMemo } from "react";
import {
  FaEdit, FaTrashAlt, FaSearch, FaSortAmountDown, FaUserPlus, FaBoxOpen, FaClipboardList
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const AssetList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Configurable

  const [editingAsset, setEditingAsset] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "", productType: "Returnable", productQuantity: 1, productImage: "",
  });

  useEffect(() => { fetchAssets(); }, [user?.email]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/assets/hr/${user?.email}`);
      setAssets(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const processedAssets = useMemo(() => {
    let data = [...assets];
    if (search) data = data.filter((a) => a.productName.toLowerCase().includes(search.toLowerCase()));
    if (filter) data = data.filter((a) => a.productType === filter);
    if (sort) data.sort((a, b) => b.productQuantity - a.productQuantity);
    return data;
  }, [assets, search, filter, sort]);

  const totalPages = Math.ceil(processedAssets.length / itemsPerPage);
  const paginatedAssets = processedAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* --- ACTIONS (Delete/Update remain same as your logic) --- */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Confirm Delete?", text: "This action cannot be undone!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Delete Now"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/assets/${id}`);
          toast.success("Asset removed from inventory");
          fetchAssets();
        } catch { toast.error("Could not delete asset"); }
      }
    });
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.put(`/assets/${editingAsset._id}`, { ...editForm, availableQuantity: editForm.productQuantity });
      toast.success("Inventory updated");
      setEditingAsset(null);
      fetchAssets();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* 1. TOP HEADER & SUMMARY */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Asset Inventory</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <FaClipboardList className="text-primary" /> Managing {assets.length} total items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <input
                type="text" placeholder="Search assets..."
                className="input input-bordered w-full md:w-64 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>

            <select 
              className="select select-bordered bg-slate-50"
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>

            <select 
              className="select select-bordered bg-slate-50 font-semibold text-primary"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
            </select>

            <button 
              className={`btn btn-outline border-slate-200 hover:bg-slate-100 text-slate-600 ${sort && "btn-primary text-white"}`}
              onClick={() => setSort(!sort)}
            >
              <FaSortAmountDown /> Sort Qty
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE SECTION */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead className="bg-slate-50/50 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-5 pl-8">Asset Details</th>
                <th>Category</th>
                <th>Stock Status</th>
                <th>Added Date</th>
                <th className="text-center pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
              ) : paginatedAssets.map((asset) => (
                <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img src={asset.productImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-base">{asset.productName}</div>
                        <div className="text-xs text-slate-400">ID: {asset._id.slice(-6).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                      asset.productType === "Returnable" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {asset.productType}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">{asset.availableQuantity}</span>
                        <span className="text-slate-400 text-xs">/ {asset.productQuantity} available</span>
                       </div>
                       <progress className={`progress w-24 ${asset.availableQuantity < 2 ? 'progress-error' : 'progress-primary'}`} value={asset.availableQuantity} max={asset.productQuantity}></progress>
                    </div>
                  </td>
                  <td className="text-slate-500 text-sm font-medium">
                    {new Date(asset.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="pr-8">
                    <div className="flex justify-center items-center gap-1">
                      <Link to={`/dashboard/assign-asset/${asset._id}`} className="btn btn-ghost btn-circle btn-sm text-emerald-600 hover:bg-emerald-50" title="Assign">
                        <FaUserPlus size={16} />
                      </Link>
                      <button onClick={() => { setEditingAsset(asset); setEditForm({...asset}); }} className="btn btn-ghost btn-circle btn-sm text-blue-600 hover:bg-blue-50" title="Edit">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(asset._id)} className="btn btn-ghost btn-circle btn-sm text-rose-600 hover:bg-rose-50" title="Delete">
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-slate-100 bg-slate-50/30">
            <span className="text-sm text-slate-500 mb-4 sm:mb-0">
              Showing <span className="font-bold text-slate-700">{paginatedAssets.length}</span> assets on this page
            </span>
            <div className="join bg-white border border-slate-200 shadow-sm">
              <button className="join-item btn btn-sm px-4 hover:bg-slate-50" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`join-item btn btn-sm px-4 ${currentPage === num ? "btn-primary text-white" : "bg-white hover:bg-slate-50 text-slate-600 border-none"}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button className="join-item btn btn-sm px-4 hover:bg-slate-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MODAL UPGRADE (Glassmorphism effect) */}
      {editingAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Update Asset</h3>
              <button onClick={() => setEditingAsset(null)} className="btn btn-ghost btn-sm btn-circle">✕</button>
            </div>
            <div className="p-8 space-y-4">
              <div className="form-control">
                <label className="label text-xs font-bold uppercase text-slate-500">Product Name</label>
                <input name="productName" value={editForm.productName} onChange={(e) => setEditForm({...editForm, productName: e.target.value})} className="input input-bordered focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase text-slate-500">Quantity</label>
                  <input type="number" name="productQuantity" value={editForm.productQuantity} onChange={(e) => setEditForm({...editForm, productQuantity: Number(e.target.value)})} className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label text-xs font-bold uppercase text-slate-500">Category</label>
                  <select value={editForm.productType} onChange={(e) => setEditForm({...editForm, productType: e.target.value})} className="select select-bordered">
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                  </select>
                </div>
              </div>
              <div className="form-control pt-4">
                <button className="btn btn-primary w-full text-white shadow-lg shadow-primary/20" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;