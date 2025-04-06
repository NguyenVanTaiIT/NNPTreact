// Application constants
export const APP_NAME = 'Room Booking System';
export const APP_VERSION = '1.0.0';

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme'
};

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token'
    },
    USER: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile/update'
    },
    ROOM: {
        BASE: '/rooms',
        AVAILABLE: '/rooms/available',
        BOOKED: '/rooms/booked'
    },
    BOOKING: {
        BASE: '/bookings',
        USER_BOOKINGS: '/bookings/user',
        ROOM_BOOKINGS: '/bookings/room'
    }
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
    DATETIME: 'DD/MM/YYYY HH:mm:ss'
};

// File upload limits
export const UPLOAD_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif']
};

// Theme settings
export const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
};

// User roles
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

// Status codes
export const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    CANCELLED: 'cancelled'
}; 