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
                const userRole = localStorage.getItem('userRole');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token) {
                    setIsAdmin(false);
                    return;
                }

                // Kiểm tra vai trò admin
                if (userRole && userRole.toLowerCase() === 'admin') {
                    setIsAdmin(true);
                } else if (user && user.role && typeof user.role === 'object' && user.role.roleName && user.role.roleName.toLowerCase() === 'admin') {
                    setIsAdmin(true);
                } else if (user && user.role && typeof user.role === 'string') {
                    // Nếu role là ID, lấy thông tin role
                    try {
                        // Log để debug
                        console.log('AdminRoute - Fetching role details for ID:', user.role);
                        
                        const roleResponse = await api.get(`/roles/${user.role}`);
                        console.log('AdminRoute - Role response:', roleResponse.data);
                        
                        // Kiểm tra cấu trúc dữ liệu trả về
                        if (roleResponse.data && roleResponse.data.success && roleResponse.data.data) {
                            const roleData = roleResponse.data.data;
                            if (roleData.roleName && roleData.roleName.toLowerCase() === 'admin') {
                                setIsAdmin(true);
                            } else {
                                console.log('AdminRoute - Role data is not admin:', roleData);
                                setIsAdmin(false);
                            }
                        } else {
                            console.log('AdminRoute - Unexpected role response structure:', roleResponse.data);
                            setIsAdmin(false);
                        }
                    } catch (err) {
                        console.error('Error fetching role details:', err);
                        // Thử lấy thông tin vai trò trực tiếp từ API
                        try {
                            const directResponse = await api.get(`/users/${user.id}/role`);
                            console.log('AdminRoute - Direct role response:', directResponse.data);
                            
                            // Kiểm tra cấu trúc dữ liệu trả về
                            if (directResponse.data && directResponse.data.success && directResponse.data.data) {
                                const roleData = directResponse.data.data;
                                if (roleData.roleName && roleData.roleName.toLowerCase() === 'admin') {
                                    setIsAdmin(true);
                                } else {
                                    setIsAdmin(false);
                                }
                            } else {
                                setIsAdmin(false);
                            }
                        } catch (directErr) {
                            console.error('Error fetching direct role:', directErr);
                            setIsAdmin(false);
                        }
                    }
                } else {
                    setIsAdmin(false);
                }
                
                // Log để debug
                console.log('AdminRoute - userRole:', userRole);
                console.log('AdminRoute - user:', user);
                console.log('AdminRoute - isAdmin:', isAdmin);
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