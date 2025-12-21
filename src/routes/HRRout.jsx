import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import AccessDenied from '../components/AccessDenied';

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-infinity loading-lg text-primary"></span>
            </div>
        );
    }

    if (role !== 'hr') {
        return <AccessDenied />;
    }

    return children;
};

export default AdminRoute;