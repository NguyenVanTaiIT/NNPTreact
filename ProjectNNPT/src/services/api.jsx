import axios from 'axios';

// Cấu hình axios
const axiosInstance = axios.create({
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
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thêm interceptor để xử lý lỗi
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Xử lý lỗi 401 (Unauthorized)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, {
            refreshToken
          });

          const { token } = response.data;
          localStorage.setItem('token', token);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          processQueue(null, token);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Xóa token và chuyển hướng đến trang đăng nhập
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          navigate('/login');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  isInterceptorsSetup = true;
};

// Các endpoint API
export const API_ENDPOINTS = {
  AUTH: '/auth',
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

export default axiosInstance; 