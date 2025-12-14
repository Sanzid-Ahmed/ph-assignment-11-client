import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserCircle, FaSave, FaBuilding, FaEnvelope } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth.jsx';
import useAxiosSecure from '../../hooks/useAxiosSecure.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { toast } from 'react-toastify';
import moment from 'moment';


const ProfilePage = () => {
    const { user, role, loading: authLoading, refetchUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            reset({
                name: user.displayName || user.name,
                profileImage: user.photoURL,
                dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : '',
                companyName: user.companyName,
                companyLogo: user.companyLogo,
            });
        }
    }, [user, authLoading, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const updatedData = {
            name: data.name,
            profileImage: data.profileImage,
            dateOfBirth: data.dateOfBirth,
            ...(role === 'hr' && {
                companyName: data.companyName,
                companyLogo: data.companyLogo,
            })
        };

        try {
            const res = await axiosSecure.patch(`/api/v1/users/profile/${user.email}`, updatedData);
            
            if (res.data.modifiedCount > 0 || res.data.acknowledged) {
                toast.success('Profile updated successfully!');
                refetchUser(); 
            } else {
                toast.info('No changes were made.');
            }
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error.message);
            toast.error(`Update failed: ${error.response?.data?.message || 'Server error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !user) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FaUserCircle className={role === 'hr' ? 'text-primary' : 'text-secondary'} /> My Profile
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage your personal and company details. Role: <span className='font-semibold capitalize'>{role}</span>
                </p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="card w-full shadow-xl bg-white p-6 sticky top-20">
                        <figure className="px-10 pt-10">
                            <img 
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=007AFF&color=fff&bold=true`} 
                                alt="Profile" 
                                className="rounded-full w-32 h-32 object-cover mx-auto"
                            />
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title text-2xl">{user.displayName || 'User'}</h2>
                            <p className='text-gray-600 flex items-center gap-2'><FaEnvelope /> {user.email}</p>
                            <div className={`badge badge-lg capitalize ${role === 'hr' ? 'badge-primary' : 'badge-secondary'} text-white`}>
                                {role}
                            </div>
                            
                            {role === 'hr' && (
                                <div className="mt-4 border-t pt-4 w-full">
                                    <h3 className="font-bold flex items-center justify-center gap-2 text-primary">
                                        <FaBuilding /> {user.companyName}
                                    </h3>
                                    <img src={user.companyLogo} alt="Company Logo" className='w-20 h-20 object-contain mx-auto mt-2' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 shadow-xl rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-3">Update Details</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name</span></label>
                                <input type="text" className="input input-bordered w-full" 
                                    {...register('name', { required: 'Name is required' })} 
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Profile Image URL</span></label>
                                <input type="url" className="input input-bordered w-full" 
                                    {...register('profileImage')} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Date of Birth</span></label>
                                <input type="date" className="input input-bordered w-full" 
                                    {...register('dateOfBirth')} 
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email (Cannot be changed)</span></label>
                                <input type="email" defaultValue={user.email} className="input input-bordered w-full bg-gray-100" readOnly />
                            </div>
                        </div>

                        {role === 'hr' && (
                            <>
                                <div className="divider">Company Details</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Company Name</span></label>
                                        <input type="text" className="input input-bordered w-full" 
                                            {...register('companyName', { required: 'Company Name is required' })} 
                                        />
                                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Company Logo URL</span></label>
                                        <input type="url" className="input input-bordered w-full" 
                                            {...register('companyLogo', { required: 'Company Logo URL is required' })} 
                                        />
                                        {errors.companyLogo && <p className="text-red-500 text-sm mt-1">{errors.companyLogo.message}</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-control pt-4">
                            <button 
                                type="submit" 
                                className={`btn w-full ${role === 'hr' ? 'btn-primary' : 'btn-secondary'}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <span className="loading loading-spinner"></span> : <FaSave />} 
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;