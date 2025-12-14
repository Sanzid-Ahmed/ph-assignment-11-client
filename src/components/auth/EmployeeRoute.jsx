import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const EmployeeRoute = ({ children }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && role === 'employee') {
    return children;
  }

  if (user && role !== 'employee') {
    toast.error('Access Denied. Employee privileges required.');
    return <Navigate to="/" replace />; 
  }

  return <Navigate to="/login" replace />; 
};

export default EmployeeRoute;