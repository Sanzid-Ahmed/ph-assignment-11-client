import React, { useEffect, useState } from 'react';
import { FaUsers, FaTrash, FaUserTie, FaBuilding, FaUserMinus } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment';

const MyEmployeeListPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const packageLimit = user?.packageLimit || 5;
    const currentEmployees = user?.currentEmployees || employees.length; 

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/api/v1/employees/hr/${user.email}`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setEmployees(res.data);
        } catch (error) {
            console.error('Error fetching employee list:', error);
            toast.error('Failed to load employee list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchEmployees();
        }
    }, [user, currentPage]); 


    const handleRemoveEmployee = (employeeEmail, employeeName) => {
        Swal.fire({
            title: 'Remove Employee?',
            html: `Are you sure you want to **remove ${employeeName}** from your team? This will **return all their assets** and remove the affiliation.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove!',
            confirmButtonColor: '#DC3545', 
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/api/v1/employees/remove-affiliation`, {
                        data: {
                            hrEmail: user.email,
                            employeeEmail: employeeEmail
                        }
                    });

                    if (res.data.success) {
                        toast.success(`${employeeName} removed. Assets returned and current employee count updated.`);
                        fetchEmployees(); 
                    } else {
                        toast.error('Failed to remove employee. Server error.');
                    }
                } catch (error) {
                    console.error('Removal Error:', error.response?.data || error.message);
                    toast.error(`Removal failed: ${error.response?.data?.message || 'Server error'}`);
                }
            }
        });
    };
    
    const handleNextPage = () => setCurrentPage(prev => prev + 1);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const canGoNext = employees.length === itemsPerPage; 

    if (loading) {
        return <LoadingSpinner />;
    }

    const isEmployeeListEmpty = employees.length === 0 && currentPage === 1;

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaUsers className="text-primary" /> My Affiliated Employees
                </h1>
                <p className="text-gray-600 mt-1">Manage employees affiliated with {user.companyName}.</p>
            </header>

            <div className="alert shadow-lg mb-8 bg-base-100 border-l-4 border-primary">
                <FaBuilding className='text-primary text-2xl' />
                <div className='flex flex-col md:flex-row md:items-center w-full justify-between'>
                    <div>
                        <h3 className="font-bold">Subscription Status: <span className="text-primary capitalize">{user.subscription}</span> Package</h3>
                        <p className="text-sm">
                            You are currently using **{currentEmployees} out of {packageLimit}** employee slots.
                        </p>
                    </div>
                    {currentEmployees >= packageLimit && (
                        <Link to="/hr-dashboard/upgrade-package" className="btn btn-sm btn-warning mt-2 md:mt-0">
                            Upgrade Now
                        </Link>
                    )}
                </div>
            </div>

            {isEmployeeListEmpty ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <FaUserTie className="text-5xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600">
                        No employees are currently affiliated with your company.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Employees become affiliated when you approve their first asset request.
                    </p>
                </div>
            ) : (
                <div className="bg-white p-6 shadow-xl rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Join Date</th>
                                    <th>Assets Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.employeeEmail}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.employeeName || employee.employeeEmail}&background=D6EAF8&color=007AFF&bold=true`} alt={employee.employeeName} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{employee.employeeName}</div>
                                                    <div className="text-sm opacity-50">{employee.employeeEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{moment(employee.affiliationDate).format('YYYY-MM-DD')}</td>
                                        <td className='font-bold'>{employee.assetsCount || 0}</td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-error text-white"
                                                onClick={() => handleRemoveEmployee(employee.employeeEmail, employee.employeeName)}
                                            >
                                                <FaUserMinus /> Remove from Team
                                            </button>
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

export default MyEmployeeListPage;