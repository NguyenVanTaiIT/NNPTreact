import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import ErrorMessage from '../components/utils/ErrorMessage';
import { useState, useEffect } from 'react';
import { getRoleById } from '../services/roleService';
import api from '../services/api';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const validateAdminAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userRole = localStorage.getItem('userRole');
                
                if (!token || !user) {
                    setIsAdmin(false);
                    return;
                }

                // Check if user has Admin role (with capital A)
                const storedRole = userRole || user.role || '';
                setIsAdmin(storedRole === 'Admin');
                
            } catch (err) {
                console.error('Error validating admin access:', err);
                setError('Failed to validate admin access. Please try again.');
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        validateAdminAccess();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorMessage 
                message={error} 
                onRetry={() => window.location.reload()} 
            />
        );
    }

    if (!isAdmin) {
        // Redirect to login page if not authenticated
        if (!localStorage.getItem('token')) {
            return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
        }
        
        // Redirect to home page if not authorized
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default AdminRoute; 