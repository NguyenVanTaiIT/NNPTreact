import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 