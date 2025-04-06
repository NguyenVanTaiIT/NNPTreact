import api from './api';
import axios from 'axios';

const API_ENDPOINTS = {
  AUTH: '/auth'
};

const handleApiError = (error) => {
  if (error.response) {
    // Server trả về lỗi với status code ngoài range 2xx
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    throw new Error('No response from server');
  } else {
    // Có lỗi khi setting up request
    throw new Error('Error setting up request');
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - { username, password, email, role? }
 * @returns {Promise<Object>} - Kết quả đăng ký
 */
export const register = async (userData) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.AUTH}/register`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} - Kết quả đăng nhập bao gồm token và thông tin người dùng
 */
export const login = async (credentials) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.AUTH}/login`, credentials);
    const { token, refreshToken, user } = response.data;
    
    // Lưu tokens
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Lưu thông tin người dùng
    localStorage.setItem('user', JSON.stringify(user));
    
    // Kiểm tra và lưu vai trò người dùng
    if (user.role && user.role.roleName) {
      // Nếu role là object có roleName
      localStorage.setItem('userRole', user.role.roleName);
    } else if (user.role && typeof user.role === 'string') {
      // Nếu role là ID, lưu ID
      localStorage.setItem('userRole', user.role);
      
      // Có thể fetch role details ở đây nếu cần
      try {
        const roleResponse = await api.get(`/roles/${user.role}`);
        if (roleResponse.data && roleResponse.data.roleName) {
          // Cập nhật userRole với tên role
          localStorage.setItem('userRole', roleResponse.data.roleName);
        }
      } catch (err) {
        console.error('Error fetching role details:', err);
        // Vẫn giữ nguyên userRole là ID
      }
    } else {
      // Mặc định là user nếu không có thông tin vai trò
      localStorage.setItem('userRole', 'user');
    }
    
    return { user };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns {Promise<Object>} - Thông tin người dùng
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get(`${API_ENDPOINTS.AUTH}/me`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Đăng xuất người dùng
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Refresh token
 * @returns {Promise<Object>} - Token mới
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post(`${API_ENDPOINTS.AUTH}/refresh-token`, {
      refreshToken,
    });

    const { token } = response.data;
    localStorage.setItem('token', token);
    return { token };
  } catch (error) {
    logout();
    throw handleApiError(error);
  }
}; 