import React, { useEffect, useState } from 'react';
import { FaUsers, FaBirthdayCake, FaUserTie, FaChevronRight } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import moment from 'moment';

const MyTeamPage = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [teamData, setTeamData] = useState({ employees: [], birthdays: [] });
    const [loading, setLoading] = useState(true);

    const fetchTeamData = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get(`/api/v1/employees/team/${user.email}`);
            setTeamData(res.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            toast.error('Failed to load team data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchTeamData();
        }
    }, [user]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const { employees, birthdays } = teamData;
    const isTeamEmpty = employees.length === 0;

    const BirthdayCard = ({ employee }) => {
        const nextBirthday = moment(employee.nextBirthday).format('MMMM Do');
        const daysAway = moment(employee.nextBirthday).diff(moment(), 'days') + 1; // +1 to count today as 1 day

        let colorClass = 'bg-base-100';
        if (daysAway === 1) {
            colorClass = 'bg-error text-white'; 
        } else if (daysAway <= 7) {
            colorClass = 'bg-warning text-white'; 
        }

        return (
            <div className={`card w-full shadow-lg p-4 ${colorClass}`}>
                <div className="flex items-center gap-3">
                    <FaBirthdayCake className="text-3xl flex-shrink-0" />
                    <div>
                        <p className="font-bold">{employee.name}</p>
                        <p className="text-sm">
                            Birthday: <span className='font-semibold'>{nextBirthday}</span>
                        </p>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <span className="badge badge-lg">{daysAway === 1 ? 'TODAY!' : `${daysAway} days away`}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaUsers className="text-secondary" /> My Team (Colleagues)
                </h1>
                <p className="text-gray-600 mt-1">
                    Employees affiliated with the same company as you: <span className='font-semibold'>{user.companyName || 'N/A'}</span>
                </p>
            </header>

            <div className="mb-10 p-6 bg-secondary text-white rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaBirthdayCake /> Upcoming Birthdays
                </h2>
                {birthdays && birthdays.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {birthdays.map((employee) => (
                            <BirthdayCard key={employee.email} employee={employee} />
                        ))}
                    </div>
                ) : (
                    <p className='text-lg'>No upcoming birthdays found in the next 30 days.</p>
                )}
            </div>

            <div className="bg-white p-6 shadow-xl rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Members ({employees.length})</h2>

                {isTeamEmpty ? (
                    <div className="text-center py-10 text-lg text-gray-500">
                        <FaUserTie className="text-5xl mx-auto mb-4" />
                        <p>No other colleagues found affiliated with this company yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Affiliation Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.email}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10">
                                                        <img src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.name || employee.email}&background=E3F2FD&color=3F51B5&bold=true`} alt={employee.name} />
                                                    </div>
                                                </div>
                                                <div className='font-bold'>{employee.name}</div>
                                            </div>
                                        </td>
                                        <td>{employee.email}</td>
                                        <td>
                                            <span className={`badge badge-sm ${employee.role === 'hr' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {employee.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{moment(employee.affiliationDate).format('YYYY-MM-DD')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyTeamPage;