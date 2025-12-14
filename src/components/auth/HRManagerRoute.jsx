import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const HRManagerRoute = ({ children }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && role === 'hr') {
    return children;
  }

  if (user && role !== 'hr') {
    toast.error('Access Denied. HR Manager privileges required.');
    return <Navigate to="/" replace />; 
  }

  return <Navigate to="/login" replace />; 
};

export default HRManagerRoute;