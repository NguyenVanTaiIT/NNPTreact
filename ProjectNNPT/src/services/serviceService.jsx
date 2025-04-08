import api from './api';

/**
 * Lấy danh sách tất cả các dịch vụ
 * @returns {Promise<Array>} - Danh sách dịch vụ
 */
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
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
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error.response?.data || error;
  }
};

/**
 * Tạo dịch vụ mới
 * @param {Object} serviceData - Dữ liệu dịch vụ mới
 * @returns {Promise<Object>} - Dịch vụ đã tạo
 */
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services/create', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error.response?.data || error;
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
    const response = await api.put(`/services/${serviceId}`, serviceData);
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
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể xóa dịch vụ' };
  }
};

export const getUserServices = async () => {
  try {
    const response = await api.get('/services/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user services:', error);
    throw error.response?.data || error;
  }
};

export const cancelService = async (serviceId) => {
  try {
    const response = await api.post(`/services/${serviceId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling service:', error);
    throw error.response?.data || error;
  }
};

/**
 * Tạo dịch vụ mới (chỉ dành cho admin)
 * @param {Object} serviceData - Dữ liệu dịch vụ mới
 * @returns {Promise<Object>} - Dịch vụ đã tạo
 */
export const createAdminService = async (serviceData) => {
  try {
    const response = await api.post('/services/admin/create', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin service:', error);
    throw error.response?.data || error;
  }
};
