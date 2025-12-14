import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, requiredRole = null }) => {
    const { user, loading, role } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        toast.info('Please log in to access this page.');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && role !== requiredRole) {
        toast.error(`Access denied. You must be an ${requiredRole.toUpperCase()} Manager to view this page.`);
        
        if (role === 'hr') {
            return <Navigate to="/hr-dashboard" replace />;
        }
        if (role === 'employee') {
            return <Navigate to="/employee-dashboard" replace />;
        }
        
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;