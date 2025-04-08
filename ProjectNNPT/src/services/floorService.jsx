import api from './api';

/**
 * Lấy danh sách tất cả tầng
 * @returns {Promise<Array>} - Danh sách tầng
 */
export const getAllFloors = async () => {
  try {
    const response = await api.get('/floors');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error fetching floors:', error);
    return [];
  }
};

/**
 * Lấy thông tin chi tiết tầng theo ID
 * @param {string} id - ID của tầng
 * @returns {Promise<Object>} - Thông tin chi tiết tầng
 */
export const getFloorById = async (id) => {
  try {
    const response = await api.get(`/floors/${id}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error fetching floor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo tầng mới
 * @param {Object} floorData - Dữ liệu tầng mới
 * @returns {Promise<Object>} - Tầng đã được tạo
 */
export const createFloor = async (floorData) => {
  try {
    const response = await api.post('/floors', floorData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error creating floor:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin tầng
 * @param {string} id - ID của tầng
 * @param {Object} floorData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Tầng đã được cập nhật
 */
export const updateFloor = async (id, floorData) => {
  try {
    const response = await api.put(`/floors/${id}`, floorData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error updating floor with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa tầng
 * @param {string} id - ID của tầng
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export const deleteFloor = async (id) => {
  try {
    const response = await api.delete(`/floors/${id}`);
    if (response.data && response.data.success) {
      return true;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error deleting floor with ID ${id}:`, error);
    throw error;
  }
}; 