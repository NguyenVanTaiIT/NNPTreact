import axios from 'axios';

const API_URL = 'http://localhost:3000/rooms';

/**
 * Lấy danh sách tất cả các phòng
 * @returns {Promise<Array>} - Danh sách phòng
 */
export const getAllRooms = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('API Response:', response.data);
        // Kiểm tra cấu trúc response
        if (response.data && response.data.success) {
            return response.data.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error in getAllRooms:', error);
        return [];
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
            return {
                totalRooms: 0,
                availableRooms: 0
            };
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
        return {
            totalRooms: 0,
            availableRooms: 0
        };
    }
};

export const getRoomById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
};