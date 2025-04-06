import axios from 'axios';

const API_URL = 'http://localhost:3000/services';

/**
 * Lấy danh sách tất cả các dịch vụ
 * @returns {Promise<Array>} - Danh sách dịch vụ
 */
export const getAllServices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách dịch vụ' };
  }
};

/**
 * Lấy thông tin chi tiết của một dịch vụ
 * @param {string} serviceId - ID của dịch vụ
 * @returns {Promise<Object>} - Thông tin chi tiết dịch vụ
 */
export const getServiceById = async (serviceId) => {
  try {
    const response = await axios.get(`${API_URL}/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin dịch vụ' };
  }
};

/**
 * Tạo dịch vụ mới
 * @param {Object} serviceData - Dữ liệu dịch vụ mới
 * @returns {Promise<Object>} - Dịch vụ đã tạo
 */
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(API_URL, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể tạo dịch vụ mới' };
  }
};

/**
 * Cập nhật thông tin dịch vụ
 * @param {string} serviceId - ID của dịch vụ
 * @param {Object} serviceData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Dịch vụ đã cập nhật
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(`${API_URL}/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật dịch vụ' };
  }
};

/**
 * Xóa dịch vụ
 * @param {string} serviceId - ID của dịch vụ
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_URL}/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể xóa dịch vụ' };
  }
}; 