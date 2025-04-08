import api from './api';

const API_URL = 'http://localhost:3000';

/**
 * Lấy danh sách tất cả các đặt phòng
 * @returns {Promise<Array>} - Danh sách đặt phòng
 */
export const getAllBookings = async () => {
  try {
    console.log('Fetching all bookings...');
    const response = await api.get('/bookings');
    console.log('Bookings response:', response.data);
    
    if (response.data && response.data.success) {
      // Ensure we return an array
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    return [];
  }
};

/**
 * Cập nhật trạng thái đặt phòng
 * @param {string} bookingId - ID của đặt phòng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} - Đặt phòng đã cập nhật
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`${API_URL}/bookings/${bookingId}/status`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể cập nhật trạng thái đặt phòng' };
  }
};

/**
 * Tạo đặt phòng mới
 * @param {Object} bookingData - Dữ liệu đặt phòng
 * @returns {Promise<Object>} - Đặt phòng đã tạo
 */
export const createBooking = async (bookingData) => {
  try {
    console.log('Creating new booking:', bookingData);
    const response = await api.post('/bookings', bookingData);
    console.log('Create booking response:', response);
    
    if (!response.data) {
      throw new Error('Không nhận được phản hồi từ server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error.response?.data || error;
  }
};

export const getBookingById = async (id) => {
  try {
    console.log('Fetching booking by ID:', id);
    console.log('Available booking IDs: 67f423d6735c3e070e2d50fe, 67f43dcf55798e0b923cd764');
    
    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid booking ID format in frontend:', id);
      return {
        success: false,
        message: 'ID đặt phòng không hợp lệ'
      };
    }
    
    console.log('Making API request for booking ID:', id);
    const response = await api.get(`/bookings/${id}`);
    console.log('Booking response:', response.data);
    
    if (response.data && response.data.success) {
      console.log('Successfully retrieved booking:', response.data.data._id);
      return {
        success: true,
        data: response.data.data
      };
    }
    
    console.error('Failed to retrieve booking:', response.data?.message);
    return {
      success: false,
      message: response.data?.message || 'Không thể lấy thông tin đặt phòng'
    };
  } catch (error) {
    console.error('Error in getBookingById:', error);
    
    // Handle 404 error specifically
    if (error.response && error.response.status === 404) {
      console.log('Booking not found. Available booking IDs: 67f423d6735c3e070e2d50fe, 67f43dcf55798e0b923cd764');
      return {
        success: false,
        message: 'Không tìm thấy đặt phòng này. Vui lòng kiểm tra lại ID đặt phòng.'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Không thể lấy thông tin đặt phòng'
    };
  }
};

export const getUserBookings = async () => {
  try {
    console.log('Fetching user bookings...');
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);
    
    const response = await api.get('/bookings/user');
    console.log('User bookings response:', response);
    
    if (response.data && response.data.success) {
      console.log('Bookings data:', response.data.data);
      return {
        success: true,
        data: response.data.data || []
      };
    } else {
      console.error('Failed to fetch bookings:', response.data?.message);
      return {
        success: false,
        message: response.data?.message || 'Không thể lấy danh sách đặt phòng'
      };
    }
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    console.error('Error details:', error.response?.data);
    
    // Kiểm tra lỗi xác thực
    if (error.response?.status === 401) {
      console.error('Authentication error - token may be invalid or expired');
      return {
        success: false,
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Không thể lấy danh sách đặt phòng'
    };
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    console.log('Canceling booking:', bookingId);
    const response = await api.post(`/bookings/${bookingId}/cancel`);
    console.log('Cancel booking response:', response);
    
    if (response.data && response.data.success) {
      // Kiểm tra cấu trúc response và trả về thông báo phù hợp
      const booking = response.data.data || response.data;
      return {
        success: true,
        booking: booking,
        message: response.data.message || `Bạn đã hủy đặt phòng ${booking.roomId?.name || 'này'}`
      };
    } else {
      console.error('Failed to cancel booking:', response.data);
      throw new Error(response.data?.message || 'Không thể hủy đặt phòng');
    }
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    console.error('Error details:', error.response?.data);
    
    // Kiểm tra lỗi xác thực
    if (error.response?.status === 401) {
      console.error('Authentication error - token may be invalid or expired');
      return {
        success: false,
        message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      };
    }
    
    throw error.response?.data || error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error in updateBooking:', error);
    throw error.response?.data || error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    console.log('Deleting booking:', bookingId);
    const response = await api.delete(`/bookings/${bookingId}`);
    console.log('Delete booking response:', response);
    
    if (response.data) {
      return {
        success: true,
        message: response.data.message || 'Đã xóa đặt phòng thành công'
      };
    } else {
      throw new Error('Không thể xóa đặt phòng');
    }
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    throw error;
  }
}; 