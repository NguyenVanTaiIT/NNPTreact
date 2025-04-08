import api from './api';

/**
 * Lấy danh sách tất cả phòng
 * @returns {Promise<Array>} - Danh sách phòng
 */
export const getAllRooms = async () => {
  try {
    const response = await api.get('/rooms');
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error fetching rooms:', error);
    // Trả về mảng rỗng thay vì throw error để tránh crash ứng dụng
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

/**
 * Lấy thông tin chi tiết phòng theo ID
 * @param {string} id - ID của phòng
 * @returns {Promise<Object>} - Thông tin chi tiết phòng
 */
export const getRoomById = async (id) => {
  try {
    console.log('Fetching room with ID:', id);
    const response = await api.get(`/rooms/${id}`);
    console.log('Room response:', response.data);
    
    if (response.data && response.data.success) {
      console.log('Room data:', response.data.data);
      console.log('Room availability:', response.data.data.isAvailable);
      return response.data.data;
    }
    
    console.error('Invalid response format from server:', response.data);
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

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
 * Tạo phòng mới
 * @param {Object} roomData - Dữ liệu phòng mới
 * @returns {Promise<Object>} - Phòng đã tạo
 */
export const createRoom = async (roomData) => {
  try {
    console.log('Creating room with data:', roomData);
    const response = await api.post('/rooms', roomData);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin phòng
 * @param {string} id - ID của phòng
 * @param {Object} roomData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Phòng đã cập nhật
 */
export const updateRoom = async (id, roomData) => {
  try {
    if (!id) {
      console.error('Room ID is undefined or null');
      throw new Error('Room ID is required for update');
    }
    
    console.log(`Updating room with ID ${id}:`, roomData);
    const response = await api.put(`/rooms/${id}`, roomData);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error updating room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa phòng
 * @param {string} id - ID của phòng
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteRoom = async (id) => {
  try {
    if (!id) {
      console.error('Room ID is undefined or null');
      throw new Error('Room ID is required for deletion');
    }
    
    console.log(`Deleting room with ID ${id}`);
    const response = await api.delete(`/rooms/${id}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error(`Error deleting room with ID ${id}:`, error);
    throw error;
  }
};