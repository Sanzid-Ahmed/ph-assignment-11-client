import React, { useEffect, useState } from 'react';
import { FaListAlt, FaCheck, FaTimes, FaUserCheck, FaHourglassHalf, FaRedo } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment'; 

const AllRequestsPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/api/v1/requests/hr/${user.email}`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load asset requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchRequests();
        }
    }, [user, currentPage]); 


    const handleAction = async (request, status) => {
        const actionText = status === 'approved' ? 'Approve' : 'Reject';
        const icon = status === 'approved' ? 'success' : 'error';
        const color = status === 'approved' ? '#10B981' : '#EF4444'; 

        Swal.fire({
            title: `${actionText} Request?`,
            html: `Are you sure you want to **${actionText.toLowerCase()}** the request for **${request.assetName}** from **${request.requesterName}**?`,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText} it!`,
            confirmButtonColor: color,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/api/v1/requests/${request._id}/status`, { 
                        requestStatus: status,
                        hrEmail: user.email, 
                    });

                    if (res.data.success) {
                        toast.success(`Request ${actionText.toLowerCase()} successfully!`);
                        
                        if (status === 'approved' && res.data.message) {
                             Swal.fire({
                                title: 'Success!',
                                text: res.data.message,
                                icon: 'info',
                                confirmButtonText: 'OK'
                             });
                        }
                        fetchRequests(); 
                    } else if (res.data.packageLimitReached) {
                        Swal.fire({
                            title: 'Limit Reached!',
                            html: `Cannot approve this request. Your current package limit (${user.packageLimit} employees) is full. Please <a href="/hr-dashboard/upgrade-package" class="link font-bold text-primary">upgrade your package</a>.`,
                            icon: 'warning',
                            confirmButtonText: 'Upgrade Now'
                        }).then((upgradeResult) => {
                             if(upgradeResult.isConfirmed) {
                                 window.location.href = '/hr-dashboard/upgrade-package';
                             }
                        });
                    }
                     else {
                        toast.error(`Failed to ${actionText.toLowerCase()} request.`);
                    }
                } catch (error) {
                    console.error(`${actionText} Error:`, error.response?.data || error.message);
                    toast.error(`Operation failed: ${error.response?.data?.message || 'Server error'}`);
                }
            }
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const allRequestsEmpty = requests.length === 0 && currentPage === 1;

    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const canGoNext = requests.length === itemsPerPage; // Heuristic for now

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success text-white">Approved</span>;
            case 'rejected':
                return <span className="badge badge-error text-white">Rejected</span>;
            case 'returned':
                return <span className="badge badge-info text-white">Returned</span>;
            case 'pending':
            default:
                return <span className="badge badge-warning text-white">Pending</span>;
        }
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaListAlt className="text-primary" /> Asset Requests ({requests.length})
                </h1>
                <p className="text-gray-600 mt-1">Review, approve, or reject asset requests from employees.</p>
            </header>

            {allRequestsEmpty ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <FaHourglassHalf className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600">No asset requests found for {user.companyName}.</p>
                </div>
            ) : (
                <div className="bg-white p-6 shadow-xl rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Employee</th>
                                    <th>Request Date</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request._id}>
                                        <td>
                                            <div className="font-semibold">{request.assetName}</div>
                                            <div className="text-sm opacity-50">{request.assetType}</div>
                                        </td>
                                        <td>
                                            <div className="font-semibold">{request.requesterName}</div>
                                            <div className="text-sm opacity-50">{request.requesterEmail}</div>
                                        </td>
                                        <td>{moment(request.requestDate).format('YYYY-MM-DD')}</td>
                                        <td>{getStatusBadge(request.requestStatus)}</td>
                                        <td className='max-w-[200px] whitespace-normal'>{request.note || 'N/A'}</td>
                                        <td className='w-32'>
                                            {request.requestStatus === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-success text-white tooltip" 
                                                        data-tip="Approve Request"
                                                        onClick={() => handleAction(request, 'approved')}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-error text-white tooltip"
                                                        data-tip="Reject Request"
                                                        onClick={() => handleAction(request, 'rejected')}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    {request.requestStatus === 'approved' ? `Approved on ${moment(request.approvalDate).format('MM/DD')}` : 'Processed'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="join">
                            <button 
                                className="join-item btn"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                « Previous
                            </button>
                            <button className="join-item btn">Page {currentPage}</button>
                            <button 
                                className="join-item btn"
                                onClick={handleNextPage}
                                disabled={!canGoNext}
                            >
                                Next »
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllRequestsPage;