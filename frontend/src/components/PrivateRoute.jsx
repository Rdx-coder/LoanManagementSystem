import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    if (user?.role === 'CUSTOMER') {
      return <Navigate to="/dashboard" />;
    } else if (user?.role === 'OFFICER') {
      return <Navigate to="/officer/dashboard" />;
    }
  }

  return children;
};

export default PrivateRoute;