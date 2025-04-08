import api from './api';

/**
 * Lấy danh sách tất cả các hóa đơn
 * @returns {Promise<Object>} - Object containing success status and data array
 */
export const getAllInvoices = async () => {
  try {
    console.log('Fetching all invoices...');
    const response = await api.get('/invoices/all');
    console.log('Invoices response:', response.data);
    
    if (response.data && response.data.success) {
      // The backend returns { success: true, data: invoices }
      return {
        success: true,
        data: response.data.data || [],
        message: 'Lấy danh sách hóa đơn thành công'
      };
    }
    return { success: false, data: [], message: 'Không thể lấy danh sách hóa đơn' };
  } catch (error) {
    console.error('Error in getAllInvoices:', error);
    return { success: false, data: [], message: 'Không thể lấy danh sách hóa đơn' };
  }
};

/**
 * Tạo hóa đơn mới
 * @param {Object} invoiceData - Dữ liệu hóa đơn
 * @returns {Promise<Object>} - Hóa đơn đã tạo
 */
export const createInvoice = async (invoiceData) => {
  try {
    // Lấy userId từ token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    // Giải mã token để lấy userId
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.id;

    // Kiểm tra dữ liệu bắt buộc
    if (!invoiceData.bookingId) {
      throw new Error('Thiếu thông tin bookingId');
    }

    if (!invoiceData.items || invoiceData.items.length === 0) {
      throw new Error('Thiếu thông tin items');
    }

    // Thêm userId vào dữ liệu hóa đơn
    const invoiceDataWithUserId = {
      ...invoiceData,
      userId
    };

    console.log('Sending invoice data:', invoiceDataWithUserId);

    const response = await api.post('/invoices', invoiceDataWithUserId);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getInvoiceById = async (id) => {
  try {
    console.log('Fetching invoice by ID:', id);
    const response = await api.get(`/invoices/${id}`);
    console.log('Invoice response:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data || {},
        message: 'Lấy thông tin hóa đơn thành công'
      };
    }
    return { 
      success: false, 
      data: null, 
      message: response.data?.message || 'Không thể lấy thông tin hóa đơn' 
    };
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || error.message || 'Không thể lấy thông tin hóa đơn' 
    };
  }
};

export const getUserInvoices = async () => {
  try {
    const response = await api.get('/invoices/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateInvoiceStatus = async (id, status) => {
  try {
    const response = await api.put(`/invoices/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Lấy hóa đơn theo bookingId
 * @param {string} bookingId - ID của booking
 * @returns {Promise<Object>} - Object chứa thông tin hóa đơn
 */
export const getInvoiceByBookingId = async (bookingId) => {
  try {
    const response = await api.get(`/invoices/booking/${bookingId}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thông tin hóa đơn thành công'
      };
    }
    return { success: false, data: null, message: 'Không thể lấy thông tin hóa đơn' };
  } catch (error) {
    console.error('Error in getInvoiceByBookingId:', error);
    return { success: false, data: null, message: 'Không thể lấy thông tin hóa đơn' };
  }
}; 