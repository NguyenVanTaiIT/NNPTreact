export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ROOMS_TARIFF: '/rooms-tariff',
    INTRODUCTION: '/introduction',
    GALLERY: '/gallery',
    ROOM_DETAILS: '/room-details',
    ROOM_DETAILS_WITH_ID: '/room-details/:id',

    // Protected routes (if needed in the future)
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    // Room routes (if needed in the future)
    ROOMS: '/rooms',
    ROOM_CREATE: '/rooms/create',
    ROOM_EDIT: '/rooms/:id/edit',

    // Booking routes (if needed in the future)
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: '/bookings/:id',
    BOOKING_CREATE: '/bookings/create',

    // Admin routes (if needed in the future)
    ADMIN: {
        DASHBOARD: '/admin',
        USERS: '/admin/users',
        ROOMS: '/admin/rooms',
        BOOKINGS: '/admin/bookings',
        SETTINGS: '/admin/settings'
    }
};

// Route guards configuration
export const ROUTE_GUARDS = {
    PUBLIC: ['HOME', 'LOGIN', 'REGISTER', 'ROOMS_TARIFF', 'INTRODUCTION', 'GALLERY', 'ROOM_DETAILS', 'ROOM_DETAILS_WITH_ID'],
    PROTECTED: ['DASHBOARD', 'PROFILE', 'SETTINGS', 'ROOMS', 'BOOKINGS'],
    ADMIN: ['ADMIN.DASHBOARD', 'ADMIN.USERS', 'ADMIN.ROOMS', 'ADMIN.BOOKINGS', 'ADMIN.SETTINGS']
}; 