import axios from 'axios';

const API_URL = 'http://localhost:3000/serviceBill';

/**
 * Lấy danh sách tất cả các hóa đơn dịch vụ
 * @returns {Promise<Array>} - Danh sách hóa đơn dịch vụ
 */
export const getAllServiceBills = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy danh sách hóa đơn dịch vụ' };
  }
};

/**
 * Lấy thông tin chi tiết của một hóa đơn dịch vụ
 * @param {string} billId - ID của hóa đơn
 * @returns {Promise<Object>} - Thông tin chi tiết hóa đơn
 */
export const getServiceBillById = async (billId) => {
  try {
    const response = await axios.get(`${API_URL}/${billId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy thông tin hóa đơn' };
  }
};

/**
 * Tạo hóa đơn dịch vụ mới
 * @param {Object} billData - Dữ liệu hóa đơn mới
 * @returns {Promise<Object>} - Hóa đơn đã tạo
 */
export const createServiceBill = async (billData) => {
  try {
    const response = await axios.post(API_URL, billData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể tạo hóa đơn mới' };
  }
};

/**
 * Cập nhật thông tin hóa đơn
 * @param {string} billId - ID của hóa đơn
 * @param {Object} billData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Hóa đơn đã cập nhật
 */
export const updateServiceBill = async (billId, billData) => {
  try {
    const response = await axios.put(`${API_URL}/${billId}`, billData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật hóa đơn' };
  }
};

/**
 * Xóa hóa đơn
 * @param {string} billId - ID của hóa đơn
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteServiceBill = async (billId) => {
  try {
    const response = await axios.delete(`${API_URL}/${billId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể xóa hóa đơn' };
  }
};

/**
 * Lấy hóa đơn theo ID người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array>} - Danh sách hóa đơn của người dùng
 */
export const getServiceBillsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể lấy hóa đơn của người dùng' };
  }
}; 