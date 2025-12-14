import React, { useEffect, useState } from 'react';
import { FaShoppingBasket, FaSearch, FaFilter, FaLaptop, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import RequestAssetModal from '../../components/employee/RequestAssetModal';

const AssetCard = ({ asset, onAssetSelect }) => {
    const isAvailable = asset.availableQuantity > 0;
    
    return (
        <div 
            className={`card w-full shadow-xl transition-all duration-300 ${isAvailable ? 'bg-base-100 hover:shadow-2xl hover:scale-[1.02]' : 'bg-gray-200 opacity-70'}`}
        >
            <figure className="h-40 bg-gray-100">
                <img src={asset.productImage} alt={asset.productName} className="object-contain h-full p-2" />
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-lg">
                    {asset.productName}
                    <div className={`badge badge-sm ${asset.productType === 'Returnable' ? 'badge-info' : 'badge-neutral'}`}>
                        {asset.productType}
                    </div>
                </h2>
                <p className="text-sm">
                    <FaBoxOpen className='inline text-primary mr-1' /> Company: {asset.companyName}
                </p>
                <div className="flex justify-between items-center text-sm">
                    <p className='font-semibold'>
                        Stock: <span className={`${isAvailable ? 'text-success' : 'text-error'}`}>{asset.availableQuantity}</span>
                    </p>
                    <p>Price: $999</p> 
                </div>
                <div className="card-actions justify-end mt-3">
                    <button 
                        className="btn btn-sm btn-secondary w-full"
                        onClick={() => onAssetSelect(asset)}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Request Asset' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const RequestAssetPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); 
    const [selectedAsset, setSelectedAsset] = useState(null); 

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/api/v1/assets/available`);
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching available assets:', error);
            toast.error('Failed to load assets for request.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const filteredAssets = assets
        .filter(asset => 
            (filterType === 'All' || asset.productType === filterType)
        )
        .filter(asset => 
            asset.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleAssetSelect = (asset) => {
        if (asset.availableQuantity <= 0) {
            toast.error('Cannot request: This asset is out of stock.');
            return;
        }
        setSelectedAsset(asset);
        document.getElementById('request_asset_modal').showModal();
    };

    const handleModalClose = () => {
        setSelectedAsset(null);
        document.getElementById('request_asset_modal').close();
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaShoppingBasket className="text-secondary" /> Request an Asset
                </h1>
                <p className="text-gray-600 mt-1">Browse and request available assets from companies within the AssetVerse network.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 shadow rounded-lg">
                <div className="form-control relative flex-grow">
                    <input 
                        type="text" 
                        placeholder="Search by asset name..." 
                        className="input input-bordered w-full pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="form-control w-full md:w-56">
                    <select 
                        className="select select-bordered"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All"><FaFilter className='inline mr-1' /> Filter by Type (All)</option>
                        <option value="Returnable">Returnable</option>
                        <option value="Non-returnable">Non-returnable</option>
                    </select>
                </div>
            </div>

            {filteredAssets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <FaInfoCircle className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600">
                        No assets match your search criteria.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAssets.map(asset => (
                        <AssetCard 
                            key={asset._id} 
                            asset={asset} 
                            onAssetSelect={handleAssetSelect}
                        />
                    ))}
                </div>
            )}

            {selectedAsset && (
                <RequestAssetModal 
                    asset={selectedAsset} 
                    onClose={handleModalClose} 
                    onSuccessfulRequest={fetchAssets} 
                />
            )}
        </>
    );
};

export default RequestAssetPage;