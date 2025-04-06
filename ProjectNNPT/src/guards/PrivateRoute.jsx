import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import ErrorMessage from '../components/utils/ErrorMessage';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }

                // Here you could add an API call to validate the token
                // For example: await validateTokenWithServer(token);
                
                setIsAuthenticated(true);
            } catch (err) {
                setError('Authentication failed. Please try again.');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
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

    if (!isAuthenticated) {
        // Redirect to login page but save the attempted url
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute; 