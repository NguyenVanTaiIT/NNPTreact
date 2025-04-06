import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import ErrorMessage from '../components/utils/ErrorMessage';
import { useState, useEffect } from 'react';
import { getRoleById } from '../services/roleService';
import axios from 'axios';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const validateAdminAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRole = localStorage.getItem('userRole');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token) {
                    setIsAdmin(false);
                    return;
                }

                // Kiểm tra vai trò admin
                if (userRole === 'Admin' || userRole === 'admin') {
                    setIsAdmin(true);
                } else if (user.role && user.role.roleName === 'Admin') {
                    setIsAdmin(true);
                } else if (user.role && typeof user.role === 'string') {
                    // Nếu role là ID, lấy thông tin role
                    try {
                        // Sử dụng axios trực tiếp để tránh vấn đề với interceptor
                        const roleResponse = await axios.get(`http://localhost:3000/roles/${user.role}`);
                        if (roleResponse.data && roleResponse.data.roleName === 'Admin') {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }
                    } catch (err) {
                        console.error('Error fetching role details:', err);
                        setIsAdmin(false);
                    }
                } else {
                    setIsAdmin(false);
                }
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
        // Redirect to home page if user is not an admin
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

export default AdminRoute; 