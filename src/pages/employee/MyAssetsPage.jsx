import React, { useEffect, useState } from 'react';
import { FaLaptop, FaFilePdf, FaRedo, FaHourglassHalf, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';
import { generatePdfFromElement } from '../../utilities/pdfGenerator';

const MyAssetsPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching ---
    const fetchAssets = async () => {
        setLoading(true);
        try {
            // Fetch assets assigned to the current employee
            const res = await axiosSecure.get(`/api/v1/assets/employee/${user.email}`);
            setAssignedAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
            toast.error('Failed to load assigned assets.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchAssets();
        }
    }, [user]);

    // --- Action Handlers ---
    const handleReturn = (asset) => {
        Swal.fire({
            title: `Return "${asset.assetName}"?`,
            html: `You are requesting to return the **${asset.assetType}** item to **${asset.companyName}**. This action requires HR approval.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Submit Return Request',
            confirmButtonColor: '#3B82F6', // Blue color
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Endpoint to submit a return request
                    const res = await axiosSecure.patch(`/api/v1/assets/return-request`, {
                        assetId: asset.assetId,
                        requestOwnerEmail: user.email,
                        hrEmail: asset.hrEmail, // HR who owns the asset
                        assetName: asset.assetName
                    });

                    if (res.data.success) {
                        toast.success('Return request submitted successfully. Awaiting HR approval.');
                        fetchAssets(); // Refresh list to update status
                    } else {
                        toast.error('Failed to submit return request.');
                    }
                } catch (error) {
                    console.error('Return request error:', error.response?.data || error.message);
                    toast.error(`Error: ${error.response?.data?.message || 'Server error'}`);
                }
            }
        });
    };

    const handleGeneratePdf = () => {
        if (assignedAssets.length === 0) {
            toast.error('No assets to generate a report for.');
            return;
        }
        
        const filename = `${user.displayName.replace(/\s/g, '_')}_AssetReport_${moment().format('YYYYMMDD')}.pdf`;
        
        // Pass the ID of the container we want to convert to PDF
        generatePdfFromElement('asset-list-container', filename);
        toast.info('Generating PDF report...');
    };

    // --- Filtering & Searching ---
    const filteredAssets = assignedAssets.filter(asset => 
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner />;
    }
    
    const hasReturnableAssets = assignedAssets.some(a => a.assetType === 'Returnable' && a.status === 'assigned');

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaLaptop className="text-secondary" /> My Assigned Assets
                </h1>
                <p className="text-gray-600 mt-1">
                    Viewing assets assigned by your company: <span className='font-semibold'>{user.companyName || 'N/A'}</span>
                </p>
            </header>

            {/* Action Bar: Search and PDF */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4 p-4 bg-white shadow rounded-lg">
                <div className="form-control relative">
                    <input 
                        type="text" 
                        placeholder="Search assigned asset name" 
                        className="input input-bordered w-full pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaRedo className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                
                <button 
                    onClick={handleGeneratePdf} 
                    className="btn btn-secondary text-white"
                    disabled={assignedAssets.length === 0}
                >
                    <FaFilePdf /> Generate Asset Report (PDF)
                </button>
            </div>


            {assignedAssets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <FaExclamationTriangle className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600">
                        You have no assets currently assigned.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Go to <Link to="request-asset" className='link link-secondary'>Request an Asset</Link> to start.
                    </p>
                </div>
            ) : (
                <div id="asset-list-container" className="bg-white p-6 shadow-xl rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 hidden print:block">
                        Asset Report for {user.displayName} - {moment().format('YYYY-MM-DD')}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Asset Details</th>
                                    <th>Company</th>
                                    <th>Assignment Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssets.map(asset => (
                                    <tr key={asset._id}>
                                        <td>
                                            <div className="font-semibold">{asset.assetName}</div>
                                            <div className="text-sm opacity-50">
                                                Type: 
                                                <span className={`badge badge-sm ml-1 ${asset.assetType === 'Returnable' ? 'badge-info' : 'badge-neutral'}`}>
                                                    {asset.assetType}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-semibold">{asset.companyName}</div>
                                            <div className="text-sm opacity-50">{asset.hrEmail}</div>
                                        </td>
                                        <td>{moment(asset.assignmentDate).format('YYYY-MM-DD')}</td>
                                        <td>
                                            {asset.status === 'assigned' && <span className="badge badge-success text-white">Assigned</span>}
                                            {asset.status === 'return_pending' && <span className="badge badge-warning text-white">Return Pending</span>}
                                            {asset.status === 'returned' && <span className="badge badge-info text-white">Returned</span>}
                                        </td>
                                        <td>
                                            {asset.assetType === 'Returnable' && asset.status === 'assigned' ? (
                                                <button 
                                                    className="btn btn-sm btn-outline btn-info"
                                                    onClick={() => handleReturn(asset)}
                                                >
                                                    <FaRedo /> Return Asset
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    {asset.assetType === 'Returnable' ? 'Awaiting HR' : 'Non-returnable'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyAssetsPage;