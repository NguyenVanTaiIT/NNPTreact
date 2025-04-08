import api from './api';
import axios from 'axios';

const API_ENDPOINTS = {
  AUTH: '/auths'
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
    console.log('Login request with credentials:', credentials);
    const response = await api.post(`${API_ENDPOINTS.AUTH}/login`, credentials);
    console.log('Login API response:', response.data);
    
    // Kiểm tra response có đúng định dạng không
    if (!response.data || !response.data.success || !response.data.data) {
      console.error('Invalid response format from server:', response.data);
      throw new Error('Invalid response format from server');
    }
    
    // Lấy dữ liệu từ response.data.data
    const { token, user } = response.data.data;
    
    // Kiểm tra dữ liệu user
    if (!user || !user.id) {
      console.error('Invalid user data in response:', user);
      throw new Error('Invalid user data in response');
    }
    
    // Đảm bảo user object có _id thay vì id
    const normalizedUser = {
      ...user,
      _id: user.id || user._id
    };
    
    console.log('Normalized user data:', normalizedUser);
    
    // Trả về dữ liệu đã được xử lý
    return {
      token,
      user: normalizedUser
    };
  } catch (error) {
    console.error('Login error:', error);
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