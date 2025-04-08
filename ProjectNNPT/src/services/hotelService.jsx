import api from './api';

/**
 * Lấy danh sách tất cả khách sạn
 * @returns {Promise<Array>} - Danh sách khách sạn
 */
export const getAllHotels = async () => {
  try {
    const response = await api.get('/hotels');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
};

/**
 * Lấy thông tin chi tiết khách sạn theo ID
 * @param {string} id - ID của khách sạn
 * @returns {Promise<Object>} - Thông tin chi tiết khách sạn
 */
export const getHotelById = async (id) => {
  try {
    const response = await api.get(`/hotels/${id}`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo khách sạn mới
 * @param {Object} hotelData - Dữ liệu khách sạn mới
 * @returns {Promise<Object>} - Khách sạn đã được tạo
 */
export const createHotel = async (hotelData) => {
  try {
    const response = await api.post('/hotels', hotelData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin khách sạn
 * @param {string} id - ID của khách sạn
 * @param {Object} hotelData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Khách sạn đã được cập nhật
 */
export const updateHotel = async (id, hotelData) => {
  try {
    const response = await api.put(`/hotels/${id}`, hotelData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error updating hotel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa khách sạn
 * @param {string} id - ID của khách sạn
 * @returns {Promise<boolean>} - Kết quả xóa
 */
export const deleteHotel = async (id) => {
  try {
    const response = await api.delete(`/hotels/${id}`);
    if (response.data && response.data.success) {
      return true;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error deleting hotel with ID ${id}:`, error);
    throw error;
  }
}; 