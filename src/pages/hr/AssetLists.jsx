import React, { useState, useEffect, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import AssetHeader from "../../components/hr/hrComponents/assetList/AssetHeader";
import AssetMetrics from "../../components/hr/hrComponents/assetList/AssetMetrics";
import AssetControls from "../../components/hr/hrComponents/assetList/AssetControls";
import AssetTable from "../../components/hr/hrComponents/assetList/AssetTable";
import  Pagination  from "../../components/hr/hrComponents/assetList/Pagination";
import EditAssetModal from "../../components/hr/hrComponents/assetList/EditAssetModal";



const AssetList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [editingAsset, setEditingAsset] = useState(null);
  const [editForm, setEditForm] = useState({ productName: "", productType: "Returnable", productQuantity: 1 });

  useEffect(() => { if(user?.email) fetchAssets(); }, [user?.email]);

  const fetchAssets = async () => {
    setLoading(true);
    try { const res = await axiosSecure.get(`/assets/hr/${user?.email}`); setAssets(res.data); } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const processedAssets = useMemo(() => {
    let data = [...assets];
    if (search) data = data.filter(a => a.productName.toLowerCase().includes(search.toLowerCase()));
    if (filter) data = data.filter(a => a.productType === filter);
    if (sort) data.sort((a,b)=> b.productQuantity - a.productQuantity);
    return data;
  }, [assets, search, filter, sort]);

  const totalPages = Math.ceil(processedAssets.length / itemsPerPage);
  const paginatedAssets = processedAssets.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  const stats = { total: assets.length, lowStock: assets.filter(a => a.availableQuantity<3).length, returnable: assets.filter(a=>a.productType==="Returnable").length };

  const handleDelete = (id) => {
    Swal.fire({
      title:"Confirm Deletion", text:"Removing this asset will clear its history.", icon:"warning", showCancelButton:true,
      confirmButtonColor:"#506f2f", cancelButtonColor:"#ef4444", confirmButtonText:"Yes, delete"
    }).then(async (res)=>{ if(res.isConfirmed){ try{ await axiosSecure.delete(`/assets/${id}`); toast.success("Deleted"); fetchAssets(); } catch{ toast.error("Failed"); } }});
  };

  const handleUpdate = async () => { 
    try{ await axiosSecure.put(`/assets/${editingAsset._id}`, {...editForm, availableQuantity: editForm.productQuantity}); toast.success("Updated"); setEditingAsset(null); fetchAssets(); } 
    catch { toast.error("Failed"); } 
  };

  return (
    <div className="p-4 md:p-10 bg-base-100 min-h-screen space-y-10">
      <AssetHeader />
      <AssetMetrics stats={stats} />
      <AssetControls search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
      <AssetTable paginatedAssets={paginatedAssets} loading={loading} setEditingAsset={setEditingAsset} handleDelete={handleDelete} />
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} paginatedAssets={paginatedAssets} loading={loading} />
      <EditAssetModal editingAsset={editingAsset} setEditingAsset={setEditingAsset} editForm={editForm} setEditForm={setEditForm} handleUpdate={handleUpdate} />
    </div>
  );
};

export default AssetList;
