import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserShield, FaSignInAlt, FaGoogle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
    const { signIn, googleSignIn, loading, setLoading, refetchUser } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine where to redirect after successful login
    const from = location.state?.from?.pathname || "/";
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loginError, setLoginError] = useState('');

    // --- Standard Email/Password Login ---
    const onSubmit = async (data) => {
        setLoading(true);
        setLoginError('');

        try {
            // 1. Sign in with Firebase
            const result = await signIn(data.email, data.password);
            const user = result.user;

            // 2. Fetch or update user data in MongoDB (to get current role/package limit)
            // The backend /login endpoint usually handles generating the JWT and setting the cookie.
            const { data: userData } = await axiosPublic.post('/api/v1/auth/login', { email: user.email });
            
            if (userData.success) {
                // Refetch user data to ensure context is fully updated with backend role/info
                await refetchUser(); 
                
                toast.success(`Welcome back, ${user.displayName || user.email}!`);
                
                // 3. Redirect based on user's role (optional, falls back to 'from' path)
                const userRole = userData.user.role; 
                let redirectPath = from;
                
                if (userRole === 'hr' && !from.startsWith('/employee-dashboard')) {
                    redirectPath = from === '/' || from.startsWith('/employee-dashboard') ? '/hr-dashboard' : from;
                } else if (userRole === 'employee' && !from.startsWith('/hr-dashboard')) {
                    redirectPath = from === '/' || from.startsWith('/hr-dashboard') ? '/employee-dashboard' : from;
                }
                
                navigate(redirectPath, { replace: true });

            } else {
                // Should not happen if signIn was successful, but good safeguard
                setLoginError(userData.message || "Login successful but profile retrieval failed.");
                setLoading(false);
            }

            reset();
            
        } catch (error) {
            console.error("Login Error:", error);
            const errorMessage = error.message || error.response?.data?.message || "Login failed. Check credentials.";
            setLoginError(errorMessage.includes('auth/invalid-credential') ? 'Invalid email or password.' : errorMessage);
            toast.error(loginError || "Login failed.");
            setLoading(false);
        }
    };

    // --- Google Social Login ---
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setLoginError('');

        try {
            const result = await googleSignIn();
            const user = result.user;

            // 1. Prepare user data for backend (to check if user exists or needs initial setup)
            const userInfo = {
                email: user.email,
                name: user.displayName,
                profileImage: user.photoURL,
                role: 'employee', // Default role for new signups unless explicitly verified later
            };

            // 2. Send data to backend to create user, generate JWT, and set cookie
            const { data: userData } = await axiosPublic.post('/api/v1/auth/google-login', userInfo);

            if (userData.success) {
                await refetchUser();
                toast.success(`Welcome, ${user.displayName || user.email}!`);
                
                // 3. Redirect based on role returned from backend
                const userRole = userData.user.role; 
                let redirectPath = from;

                if (userRole === 'hr') {
                    redirectPath = '/hr-dashboard';
                } else if (userRole === 'employee') {
                    redirectPath = '/employee-dashboard';
                }
                
                navigate(redirectPath, { replace: true });
            } else {
                setLoginError(userData.message || "Google login failed on the server.");
            }

        } catch (error) {
            console.error("Google Login Error:", error);
            setLoginError(error.message);
            toast.error("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <header className="text-center">
                    <FaSignInAlt className="text-5xl text-primary mx-auto mb-3" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Sign In to AssetVerse</h1>
                    <p className="text-sm text-gray-500 mt-2">Manage your corporate assets efficiently.</p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Email Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email Address</span>
                        </label>
                        <input
                            type="email"
                            placeholder="your.email@company.com"
                            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="********"
                            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover text-sm">Forgot password?</a>
                        </label>
                    </div>

                    {/* Error Message */}
                    {loginError && (
                        <div className="text-error text-sm font-semibold text-center p-2 border border-error rounded">
                            {loginError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary text-white" disabled={loading}>
                            <FaUserShield /> {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>
                
                <div className="divider">OR</div>

                {/* Social Login */}
                <div className="space-y-4">
                    <button 
                        onClick={handleGoogleSignIn} 
                        className="btn btn-outline w-full gap-3"
                        disabled={loading}
                    >
                        <FaGoogle className="text-lg text-red-600" />
                        Continue with Google
                    </button>
                </div>

                {/* Footer Link */}
                <div className="text-center text-sm mt-6">
                    Don't have an account? <Link to="/join-employee" className="link link-primary font-bold">Join as Employee</Link> or <Link to="/join-hr" className="link link-secondary font-bold">Join as HR Manager</Link>.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;