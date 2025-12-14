import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserShield, FaBuilding, FaEnvelope, FaLock, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const packages = [
    { name: "Starter", limit: 5, price: 0, description: "Free for small teams up to 5 employees." },
    { name: "Standard", limit: 10, price: 10, description: "Manage up to 10 employees." },
    { name: "Pro", limit: 20, price: 20, description: "Manage up to 20 employees." },
];

const JoinHRManagerPage = () => {
    const { createUser, googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: { packageLimit: packages[0].limit }
    });
    const [registerError, setRegisterError] = useState('');
    const [loading, setLoadingLocal] = useState(false);
    const selectedLimit = watch('packageLimit');
    const currentPackage = packages.find(p => p.limit === parseInt(selectedLimit)) || packages[0];

    const onSubmit = async (data) => {
        setLoadingLocal(true);
        setRegisterError('');

        data.packageLimit = parseInt(data.packageLimit);

        try {
            // Firebase user creation
            const result = await createUser(data.email, data.password, data.name, data.profileImage);
            const user = result.user;
            const token = await user.getIdToken();

            const newHRManager = {
                email: data.email,
                name: data.name,
                profileImage: data.profileImage,
                role: 'hr',
                companyName: data.companyName,
                companyLogo: data.companyLogo,
                packageLimit: data.packageLimit,
            };

            const res = await axiosPublic.post('/api/v1/auth/register-hr', newHRManager, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`HR Account for ${data.companyName} created successfully!`);
                reset();
                navigate('/hr-dashboard', { replace: true });
            } else {
                setRegisterError(res.data.message || 'Registration failed on the server.');
                toast.error(res.data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error("HR Manager Registration Error:", error);
            const message = error.message || "Registration failed. Please try again.";
            setRegisterError(message.includes('auth/email-already-in-use') ? 'This email is already registered.' : message);
            toast.error(message);
        } finally {
            setLoadingLocal(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoadingLocal(true);
        setRegisterError('');

        try {
            const result = await googleSignIn();
            const user = result.user;
            const token = await user.getIdToken();

            const companyName = prompt("Please enter your Company Name:");
            const companyLogo = prompt("Please enter your Company Logo URL:");

            if (!companyName || !companyLogo) {
                toast.warn("Company name and logo are required to join as HR Manager.");
                setLoadingLocal(false);
                return;
            }

            const userInfo = {
                email: user.email,
                name: user.displayName,
                profileImage: user.photoURL,
                role: 'hr',
                companyName,
                companyLogo,
                packageLimit: packages[0].limit
            };

            const res = await axiosPublic.post('/api/v1/auth/google-login', userInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`HR Account for ${companyName} created successfully!`);
                navigate('/hr-dashboard', { replace: true });
            } else {
                setRegisterError(res.data.message || "Google registration failed on the server.");
                toast.error(res.data.message || "Google registration failed.");
            }
        } catch (error) {
            console.error("Google Sign-up Error:", error);
            setRegisterError(error.message);
            toast.error("Google sign-up failed.");
        } finally {
            setLoadingLocal(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <header className="text-center">
                    <FaUserShield className="text-5xl text-primary mx-auto mb-3" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Join as HR Manager</h1>
                    <p className="text-sm text-gray-500 mt-2">Set up your company and select your initial employee limit package.</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Personal Details */}
                    <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">Personal Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register('name', { required: 'Name is required' })} placeholder="Jane Doe" className="input input-bordered w-full"/>
                        <input {...register('profileImage')} placeholder="http://image.url/photo.jpg" className="input input-bordered w-full"/>
                        <input {...register('email', { required: 'Email is required' })} type="email" placeholder="hr@company.com" className="input input-bordered w-full"/>
                        <input {...register('password', { required: 'Password is required', minLength: 6 })} type="password" placeholder="********" className="input input-bordered w-full"/>
                    </div>

                    {/* Company Details */}
                    <h2 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700 flex items-center gap-2"><FaBuilding /> Company Setup</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register('companyName', { required: 'Company Name is required' })} placeholder="AssetVerse Solutions Inc." className="input input-bordered w-full"/>
                        <input {...register('companyLogo', { required: 'Company Logo URL is required' })} placeholder="http://logo.url/logo.png" className="input input-bordered w-full"/>
                    </div>

                    {/* Package Selection */}
                    <h2 className="text-xl font-semibold border-b pb-2 pt-4 text-gray-700 flex items-center gap-2"><FaDollarSign /> Select Package</h2>
                    <select {...register('packageLimit')} className="select select-bordered w-full text-lg font-bold">
                        {packages.map(pkg => (
                            <option key={pkg.limit} value={pkg.limit}>
                                {pkg.name} ({pkg.limit} Employees) - {pkg.price === 0 ? 'FREE' : `$${pkg.price}/mo`}
                            </option>
                        ))}
                    </select>

                    <div className={`alert ${currentPackage.price === 0 ? 'alert-success' : 'alert-info'} shadow-lg p-3 text-sm`}>
                        <FaUsers />
                        <div>
                            <h3 className="font-bold">Package: {currentPackage.name}</h3>
                            <p>{currentPackage.description}</p>
                            <p>Cost: <span className='font-extrabold'>{currentPackage.price === 0 ? 'FREE' : `$${currentPackage.price} per month`}</span></p>
                        </div>
                    </div>

                    {registerError && <div className="text-error text-sm font-semibold text-center p-2 border border-error rounded">{registerError}</div>}

                    <button type="submit" className="btn btn-secondary text-white w-full mt-6" disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : <FaUserShield />} {loading ? 'Registering...' : 'Register as HR Manager'}
                    </button>
                </form>

                <div className="divider">OR</div>
                <button onClick={handleGoogleSignIn} className="btn btn-outline w-full gap-3" disabled={loading}>
                    <FaBuilding className="text-lg text-red-600"/> Continue with Google (Requires Company Info prompt)
                </button>

                <div className="text-center text-sm mt-6">
                    Already have an account? <Link to="/login" className="link link-secondary font-bold">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default JoinHRManagerPage;
