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
    setupAxiosInterceptors(navigate);

    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser._id) {
            setUser(parsedUser);
          } else {
            clearAuthData();
          }
        } catch (error) {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
      setLoading(false);
    };

    const clearAuthData = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogin = async (credentials) => {
    try {
      const response = await loginService(credentials);
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response format from server');
      }

      const user = response.user;
      const role = user.role 
        ? (typeof user.role === 'string' ? user.role : user.role.roleName) 
        : '';
      const normalizedRole = role.toLowerCase() === 'admin' ? 'Admin' : role;

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', normalizedRole);

      setUser(user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleUpdateUser = (updatedUser) => {
    try {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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