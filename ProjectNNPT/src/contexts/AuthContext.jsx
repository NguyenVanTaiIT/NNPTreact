import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, logout as logoutService } from '../services/authService';
import { setupAxiosInterceptors } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cài đặt interceptors cho axios
    setupAxiosInterceptors(navigate);

    // Kiểm tra trạng thái đăng nhập khi component mount
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        
        if (token && userData && userData !== 'undefined' && userData !== 'null') {
          try {
            const parsedUser = JSON.parse(userData);
            
            // Kiểm tra xem user object có đầy đủ thông tin không
            if (parsedUser && parsedUser._id) {
              setUser(parsedUser);
            } else {
              // Clear invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userRole');
            }
          } catch (parseError) {
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
          }
        } else {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        // Xóa dữ liệu không hợp lệ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogin = async (credentials) => {
    try {
      const response = await loginService(credentials);
      
      // Kiểm tra response có đúng định dạng không
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response format from server');
      }
      
      console.log('Login response:', response);
      
      // Normalize role name to 'Admin' with capital A
      let roleName = '';
      if (response.user.role) {
        if (typeof response.user.role === 'object' && response.user.role.roleName) {
          // Ensure proper case for Admin role
          roleName = response.user.role.roleName.toLowerCase() === 'admin' ? 'Admin' : response.user.role.roleName;
        } else if (typeof response.user.role === 'string') {
          // Ensure proper case for Admin role
          roleName = response.user.role.toLowerCase() === 'admin' ? 'Admin' : response.user.role;
        }
      }
      
      // Store normalized data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', roleName);
      
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa dữ liệu đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login: handleLogin,
      logout: handleLogout,
      updateUser: handleUpdateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 