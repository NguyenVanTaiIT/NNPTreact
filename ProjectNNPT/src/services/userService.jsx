import axiosInstance, { API_ENDPOINTS, handleApiError } from './api';

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINTS.AUTH}/login`, credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINTS.AUTH}/register`, userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Array>} - Danh sách người dùng
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS);
    console.log('Users API Response:', response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.success) {
      return response.data.data || [];
    } else if (Array.isArray(response.data)) {
      // Nếu response.data là mảng trực tiếp
      return response.data;
    }
    
    console.error('Unexpected API response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
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
    console.log('userService - Creating user with data:', userData);
    const response = await axiosInstance.post(`${API_ENDPOINTS.USERS}/register`, userData);
    console.log('userService - Create response:', response.data);
    return response.data;
  } catch (error) {
    console.error('userService - Error creating user:', error);
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
    console.log('userService - Updating user with ID:', userId);
    console.log('userService - Update data:', userData);
    
    const response = await axiosInstance.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
    console.log('userService - Update response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('userService - Error updating user:', error);
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
    console.log('userService - Deleting user with ID:', userId);
    
    const response = await axiosInstance.delete(`${API_ENDPOINTS.USERS}/${userId}`);
    console.log('userService - Delete response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('userService - Error deleting user:', error);
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
    const users = await getAllUsers();
    
    if (!Array.isArray(users)) {
      console.error('Users is not an array:', users);
      return {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0
      };
    }
    
    // Tính toán thống kê
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const adminUsers = users.filter(user => {
      if (typeof user.role === 'object') {
        return user.role?.roleName?.toLowerCase() === 'admin';
      }
      return false;
    }).length;
    
    return {
      totalUsers,
      activeUsers,
      adminUsers
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0
    };
  }
};
