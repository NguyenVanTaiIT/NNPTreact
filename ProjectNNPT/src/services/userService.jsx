import axios from 'axios';
import axiosInstance from '../config/axios';
import { API_ENDPOINTS, handleApiError } from '../config/api';

const API_URL = 'http://localhost:3000/users';

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập thất bại' };
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng ký thất bại' };
  }
};

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Array>} - Danh sách người dùng
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS);
    // Đảm bảo trả về một mảng
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    // Trả về mảng rỗng khi có lỗi
    return [];
  }
};

/**
 * Tạo người dùng mới
 * @param {Object} userData - Dữ liệu người dùng mới
 * @returns {Promise<Object>} - Người dùng đã tạo
 */
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy thông tin chi tiết của một người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Thông tin chi tiết người dùng
 */
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Người dùng đã cập nhật
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Xóa người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy thông tin hồ sơ người dùng
 * @returns {Promise<Object>} - Thông tin hồ sơ người dùng
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.USERS}/profile`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Cập nhật mật khẩu người dùng
 * @param {Object} passwordData - Dữ liệu mật khẩu mới
 * @returns {Promise<Object>} - Kết quả cập nhật mật khẩu
 */
export const updatePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy thống kê về người dùng
 * @returns {Promise<Object>} - Thống kê về người dùng
 */
export const getUserStats = async () => {
  try {
    // Lấy tất cả người dùng và tính toán thống kê
    const users = await getAllUsers();
    
    // Kiểm tra xem users có phải là mảng không
    if (!Array.isArray(users)) {
      console.error('Users is not an array:', users);
      return {
        totalUsers: 0
      };
    }
    
    // Tính toán thống kê
    const totalUsers = users.length;
    
    return {
      totalUsers
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    
    // Trả về dữ liệu mẫu khi không thể lấy dữ liệu từ API
    return {
      totalUsers: 0
    };
  }
};
