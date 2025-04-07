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
    if (user && user.role) {
      if (typeof user.role === 'object' && user.role.roleName) {
        // Nếu role là object có roleName
        localStorage.setItem('userRole', user.role.roleName.toLowerCase());
      } else if (typeof user.role === 'string') {
        // Nếu role là ID, lấy thông tin role
        try {
          // Log để debug
          console.log('Fetching role details for ID:', user.role);
          
          const roleResponse = await api.get(`/roles/${user.role}`);
          console.log('Role response:', roleResponse.data);
          
          // Kiểm tra cấu trúc dữ liệu trả về
          if (roleResponse.data && roleResponse.data.success && roleResponse.data.data) {
            const roleData = roleResponse.data.data;
            if (roleData.roleName) {
              // Cập nhật userRole với tên role
              localStorage.setItem('userRole', roleData.roleName.toLowerCase());
            } else {
              console.log('Role data is missing roleName:', roleData);
              localStorage.setItem('userRole', 'user');
            }
          } else {
            console.log('Unexpected role response structure:', roleResponse.data);
            localStorage.setItem('userRole', 'user');
          }
        } catch (err) {
          console.error('Error fetching role details:', err);
          // Thử lấy thông tin vai trò trực tiếp từ API
          try {
            const directResponse = await api.get(`/users/${user.id}/role`);
            console.log('Direct role response:', directResponse.data);
            
            // Kiểm tra cấu trúc dữ liệu trả về
            if (directResponse.data && directResponse.data.success && directResponse.data.data) {
              const roleData = directResponse.data.data;
              if (roleData.roleName) {
                localStorage.setItem('userRole', roleData.roleName.toLowerCase());
              } else {
                localStorage.setItem('userRole', 'user');
              }
            } else {
              localStorage.setItem('userRole', 'user');
            }
          } catch (directErr) {
            console.error('Error fetching direct role:', directErr);
            localStorage.setItem('userRole', 'user');
          }
        }
      } else {
        // Nếu role không phải object hoặc string
        localStorage.setItem('userRole', 'user');
      }
    } else {
      // Mặc định là user nếu không có thông tin vai trò
      localStorage.setItem('userRole', 'user');
    }
    
    // Log để debug
    console.log('User role after login:', localStorage.getItem('userRole'));
    console.log('User data after login:', user);
    
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