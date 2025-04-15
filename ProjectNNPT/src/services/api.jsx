import axios from 'axios';

// Cấu hình axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Biến để theo dõi trạng thái cài đặt interceptor
let isInterceptorsSetup = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Cài đặt interceptors cho axios instance
 * @param {Function} navigate - Function điều hướng từ react-router
 */
export const setupAxiosInterceptors = (navigate) => {
  // Tránh cài đặt interceptors nhiều lần
  if (isInterceptorsSetup) {
    return;
  }

  // Thêm interceptor để tự động thêm token vào header
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('Request interceptor - No token available');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor để xử lý lỗi
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  isInterceptorsSetup = true;
};

// Các endpoint API
export const API_ENDPOINTS = {
  AUTH: '/auths',
  USERS: '/users',
  ROLES: '/roles',
  ROOMS: '/rooms',
  BOOKINGS: '/bookings'
};

// Hàm xử lý lỗi API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server trả về lỗi với status code ngoài range 2xx
    const errorMessage = error.response.data?.message || 'An error occurred';
    const errorCode = error.response.status;
    return { message: errorMessage, code: errorCode };
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    return { message: 'No response from server', code: 0 };
  } else {
    // Có lỗi khi setting up request
    return { message: 'Error setting up request', code: 0 };
  }
};

export default api; 