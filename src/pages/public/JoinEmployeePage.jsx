import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserPlus, FaEnvelope, FaLock, FaBuilding, FaUserTie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const JoinEmployeePage = () => {
    const { createUser, googleSignIn, setLoading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [registerError, setRegisterError] = useState('');
    const [loading, setLoadingLocal] = useState(false);

    // --- Standard Email/Password Registration ---
    const onSubmit = async (data) => {
        setLoadingLocal(true);
        setRegisterError('');

        try {
            // 1. Create user in Firebase Authentication
            const result = await createUser(data.email, data.password, data.name, data.profileImage);
            const user = result.user;

            // 2. Get Firebase ID token
            const token = await user.getIdToken();

            // 3. Prepare user data for backend (remove password!)
            const newUser = {
                email: data.email,
                name: data.name,
                profileImage: data.profileImage,
                role: 'employee',
                hrEmail: data.hrEmail
            };

            // 4. Send user info to backend with Firebase token
            const res = await axiosPublic.post('/api/v1/auth/register-employee', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Employee account created successfully! Welcome to AssetVerse.');
                reset();
                navigate('/employee-dashboard', { replace: true });
            } else {
                setRegisterError(res.data.message || 'Registration failed on the server.');
                toast.error(res.data.message || 'Registration failed.');
            }

        } catch (error) {
            console.error("Employee Registration Error:", error);
            const message = error.message || "Registration failed. Please try again.";
            setRegisterError(message.includes('auth/email-already-in-use') 
                ? 'This email is already registered.' 
                : message
            );
            toast.error(message);
        } finally {
            setLoadingLocal(false);
        }
    };

    // --- Google Social Login ---
    const handleGoogleSignIn = async () => {
        setLoadingLocal(true);
        setRegisterError('');

        try {
            const result = await googleSignIn();
            const user = result.user;

            const hrEmail = prompt("Please enter the email of your HR Manager for affiliation:");
            if (!hrEmail) {
                toast.warn("Affiliation email is required to join as an employee.");
                setLoadingLocal(false);
                return;
            }

            const token = await user.getIdToken();

            const userInfo = {
                email: user.email,
                name: user.displayName,
                profileImage: user.photoURL,
                role: 'employee',
                hrEmail
            };

            const res = await axiosPublic.post('/api/v1/auth/google-login', userInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success(`Welcome, ${user.displayName || user.email}! Affiliation successful.`);
                navigate('/employee-dashboard', { replace: true });
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
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <header className="text-center">
                    <FaUserPlus className="text-5xl text-primary mx-auto mb-3" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Join as an Employee</h1>
                    <p className="text-sm text-gray-500 mt-2">Sign up and affiliate with your company's HR Manager.</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Full Name</span></label>
                            <input type="text" placeholder="John Doe" className="input input-bordered w-full"
                                {...register('name', { required: 'Name is required' })} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Profile Image URL (Optional)</span></label>
                            <input type="url" placeholder="http://image.url/photo.jpg" className="input input-bordered w-full"
                                {...register('profileImage')} />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-medium flex items-center gap-1"><FaEnvelope /> Email Address</span></label>
                        <input type="email" placeholder="your.email@company.com" className="input input-bordered w-full"
                            {...register('email', { required: 'Email is required' })} />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-medium flex items-center gap-1"><FaLock /> Password</span></label>
                        <input type="password" placeholder="********" className="input input-bordered w-full"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text font-bold text-secondary flex items-center gap-1"><FaUserTie /> HR Manager's Email</span></label>
                        <input type="email" placeholder="hr.manager@company.com" className="input input-bordered w-full"
                            {...register('hrEmail', { required: 'HR Affiliation Email is required' })} />
                        {errors.hrEmail && <p className="text-red-500 text-sm mt-1">{errors.hrEmail.message}</p>}
                    </div>

                    {registerError && (
                        <div className="text-error text-sm font-semibold text-center p-2 border border-error rounded">
                            {registerError}
                        </div>
                    )}

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary text-white" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : <FaUserPlus />} 
                            {loading ? 'Registering...' : 'Complete Employee Registration'}
                        </button>
                    </div>
                </form>

                <div className="divider">OR</div>

                <div className="space-y-4">
                    <button onClick={handleGoogleSignIn} className="btn btn-outline w-full gap-3" disabled={loading}>
                        <FaBuilding className="text-lg text-red-600" />
                        Continue with Google (Requires HR Email prompt)
                    </button>
                </div>

                <div className="text-center text-sm mt-6">
                    Already have an account? <Link to="/login" className="link link-primary font-bold">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default JoinEmployeePage;
