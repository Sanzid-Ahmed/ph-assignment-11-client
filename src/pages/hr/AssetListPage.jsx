import React, { useEffect, useState } from 'react';
import { FaBoxes, FaEdit, FaTrash, FaChartPie, FaChartBar, FaSearch } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import DataChart from '../../components/dashboard/DataChart'; 
import Swal from 'sweetalert2';

const AssetListPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartsData, setChartsData] = useState(null);

  const fetchAssetsAndAnalytics = async () => {
    setLoading(true);
    try {
      const assetRes = await axiosSecure.get(`/api/v1/assets/hr/${user.email}`);
      setAssets(assetRes.data);

      const analyticsRes = await axiosSecure.get(`/api/v1/analytics/hr/${user.email}`);
      setChartsData(analyticsRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load assets or analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAssetsAndAnalytics();
    }
  }, [user]);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the asset: ${name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/api/v1/assets/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success(`${name} deleted successfully!`);
            fetchAssetsAndAnalytics(); 
          }
        } catch (error) {
          console.error('Delete error:', error);
          toast.error('Failed to delete asset.');
        }
      }
    });
  };

  const handleEdit = (asset) => {
    console.log('Editing asset:', asset);
    toast.info(`Edit feature for ${asset.productName} not implemented yet.`);
  };

  const filteredAssets = assets.filter(asset => 
    asset.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }


  
  const ChartContainer = ({ title, icon: Icon, children }) => (
    <div className="card bg-white shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Icon className="text-primary" /> {title}
        </h3>
        {children}
    </div>
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <FaBoxes className="text-primary" /> Asset Inventory Overview
        </h1>
        <p className="text-gray-600 mt-1">Manage and monitor all assets belonging to {user.companyName}.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ChartContainer title="Asset Type Distribution" icon={FaChartPie}>
          {chartsData?.pieChartData ? (
             <DataChart type="Pie" data={chartsData.pieChartData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No data available for Pie Chart.</p>
            </div>
          )}
        </ChartContainer>

        <ChartContainer title="Top 5 Requested Assets" icon={FaChartBar}>
          {chartsData?.barChartData ? (
            <DataChart type="Bar" data={chartsData.barChartData} />
          ) : (
             <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No data available for Bar Chart.</p>
            </div>
          )}
        </ChartContainer>
      </section>

      <section className="bg-white p-6 shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">Your Company Assets ({assets.length})</h2>
          <div className="form-control relative">
            <input 
              type="text" 
              placeholder="Search by Asset Name" 
              className="input input-bordered w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {assets.length === 0 ? (
            <div className="text-center py-10 text-lg text-gray-500">
                No assets found in your inventory. <Link to="add-asset" className='link link-primary'>Add the first one!</Link>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Total Qty</th>
                            <th>Available Qty</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map(asset => (
                            <tr key={asset._id}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={asset.productImage} alt={asset.productName} />
                                        </div>
                                    </div>
                                </td>
                                <td className="font-semibold">{asset.productName}</td>
                                <td>
                                    <span className={`badge ${asset.productType === 'Returnable' ? 'badge-info' : 'badge-neutral'}`}>
                                        {asset.productType}
                                    </span>
                                </td>
                                <td>{asset.productQuantity}</td>
                                <td className={`font-bold ${asset.availableQuantity === 0 ? 'text-red-500' : 'text-success'}`}>
                                    {asset.availableQuantity}
                                </td>
                                <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button 
                                            className="btn btn-sm btn-warning text-white"
                                            onClick={() => handleEdit(asset)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-error text-white"
                                            onClick={() => handleDelete(asset._id, asset.productName)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </section>
    </>
  );
};

export default AssetListPage;