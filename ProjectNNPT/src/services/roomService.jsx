import axiosInstance, { API_ENDPOINTS, handleApiError } from './api';

/**
 * Lấy danh sách tất cả các phòng
 * @returns {Promise<Array>} - Danh sách phòng
 */
export const getAllRooms = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.ROOMS);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.success) {
            return response.data.data || [];
        } else if (Array.isArray(response.data)) {
            return response.data;
        }
        
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error in getAllRooms:', error);
        throw handleApiError(error);
    }
};

/**
 * Lấy thống kê về phòng
 * @returns {Promise<Object>} - Thống kê về phòng
 */
export const getRoomStats = async () => {
    try {
        // Lấy tất cả phòng và tính toán thống kê
        const rooms = await getAllRooms();
        console.log('Rooms in getRoomStats:', rooms);
        
        // Kiểm tra xem rooms có phải là mảng không
        if (!Array.isArray(rooms)) {
            console.error('Rooms is not an array:', rooms);
            throw new Error('Invalid rooms data format');
        }
        
        // Tính toán thống kê
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room.isAvailable === true).length;
        
        console.log('Room stats:', { totalRooms, availableRooms });
        
        return {
            totalRooms,
            availableRooms
        };
    } catch (error) {
        console.error('Error in getRoomStats:', error);
        throw handleApiError(error);
    }
};

/**
 * Lấy thông tin chi tiết của một phòng
 * @param {string} id - ID của phòng
 * @returns {Promise<Object>} - Thông tin chi tiết phòng
 */
export const getRoomById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ROOMS}/${id}`);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.success) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw handleApiError(error);
  }
};

const fetchRooms = async () => {
    try {
        const rooms = await getAllRooms();
        console.log('Fetched Rooms:', rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
};

// Call the function to fetch rooms
fetchRooms();