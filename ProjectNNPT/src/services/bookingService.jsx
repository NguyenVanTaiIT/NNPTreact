import axios from 'axios';

const API_URL = 'http://localhost:3000/bookings';

/**
 * Lấy danh sách tất cả các đặt phòng
 * @returns {Promise<Array>} - Danh sách đặt phòng
 */
export const getAllBookings = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy danh sách đặt phòng' };
    }
};

/**
 * Lấy thông tin chi tiết của một đặt phòng
 * @param {string} bookingId - ID của đặt phòng
 * @returns {Promise<Object>} - Thông tin chi tiết đặt phòng
 */
export const getBookingById = async (bookingId) => {
    try {
        const response = await axios.get(`${API_URL}/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy thông tin đặt phòng' };
    }
};

/**
 * Tạo đặt phòng mới
 * @param {Object} bookingData - Dữ liệu đặt phòng mới
 * @returns {Promise<Object>} - Đặt phòng đã tạo
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(API_URL, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể tạo đặt phòng mới' };
    }
};

/**
 * Cập nhật thông tin đặt phòng
 * @param {string} bookingId - ID của đặt phòng
 * @param {Object} bookingData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Đặt phòng đã cập nhật
 */
export const updateBooking = async (bookingId, bookingData) => {
    try {
        const response = await axios.put(`${API_URL}/${bookingId}`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể cập nhật đặt phòng' };
    }
};

/**
 * Xóa đặt phòng
 * @param {string} bookingId - ID của đặt phòng
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteBooking = async (bookingId) => {
    try {
        const response = await axios.delete(`${API_URL}/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể xóa đặt phòng' };
    }
};

/**
 * Lấy danh sách đặt phòng theo ID phòng
 * @param {string} roomId - ID của phòng
 * @returns {Promise<Array>} - Danh sách đặt phòng của phòng
 */
export const getBookingsByRoomId = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/room/${roomId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy danh sách đặt phòng của phòng' };
    }
};

/**
 * Lấy danh sách đặt phòng theo ID người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array>} - Danh sách đặt phòng của người dùng
 */
export const getBookingsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy danh sách đặt phòng của người dùng' };
    }
}; 