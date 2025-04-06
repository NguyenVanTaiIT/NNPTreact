import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import ErrorMessage from '../components/utils/ErrorMessage';
import { useState, useEffect } from 'react';

const AuthGuard = ({ children, requiredRole = null }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const validateAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRole = localStorage.getItem('userRole');

                if (!token) {
                    setHasAccess(false);
                    return;
                }

                // Here you could add an API call to validate the token and role
                // For example: await validateUserAccess(token, requiredRole);
                
                // Check if specific role is required
                if (requiredRole) {
                    setHasAccess(userRole === requiredRole);
                } else {
                    setHasAccess(true);
                }
            } catch (err) {
                setError('Failed to validate access. Please try again.');
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        validateAccess();
    }, [requiredRole]);

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

    if (!hasAccess) {
        // Redirect to login page if not authenticated
        if (!localStorage.getItem('token')) {
            return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
        }
        
        // Redirect to home page if not authorized
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default AuthGuard; 