export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auths`,
  USERS: `${API_BASE_URL}/users`,
  ROLES: `${API_BASE_URL}/roles`,
  ROOMS: `${API_BASE_URL}/rooms`,
  BOOKINGS: `${API_BASE_URL}/bookings`,
  SERVICES: `${API_BASE_URL}/services`,
  SERVICE_BILLS: `${API_BASE_URL}/servicesBills`,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
};

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return { message: ERROR_MESSAGES.UNAUTHORIZED, code: status };
      case HTTP_STATUS.FORBIDDEN:
        return { message: ERROR_MESSAGES.FORBIDDEN, code: status };
      case HTTP_STATUS.NOT_FOUND:
        return { message: ERROR_MESSAGES.NOT_FOUND, code: status };
      case HTTP_STATUS.BAD_REQUEST:
        return { message: data.message || 'Dữ liệu không hợp lệ', code: status };
      default:
        return { message: ERROR_MESSAGES.SERVER_ERROR, code: status };
    }
  }
  
  if (error.request) {
    return { message: ERROR_MESSAGES.NETWORK_ERROR, code: 0 };
  }
  
  return { message: error.message || ERROR_MESSAGES.SERVER_ERROR, code: 500 };
}; 