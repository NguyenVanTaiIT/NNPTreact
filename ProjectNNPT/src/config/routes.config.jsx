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

    // Protected routes
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    BOOKING: '/booking/:id',
    BOOKING_SUCCESS: '/booking-success',
    MY_BOOKINGS: '/my-bookings',
    MY_INVOICES: '/my-invoices',
    MY_SERVICES: '/my-services',
    INVOICE_DETAIL: '/invoices/:id',
    SERVICE_DETAIL: '/service/:id',
    PAYMENT: '/payment/:id',

    // Room routes
    ROOMS: '/rooms',
    ROOM_CREATE: '/rooms/create',
    ROOM_EDIT: '/rooms/:id/edit',

    // Booking routes
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: '/bookings/:id',
    BOOKING_CREATE: '/bookings/create',

    // Admin routes
    ADMIN: {
        DASHBOARD: '/admin',
        USERS: '/admin/users',
        ROOMS: '/admin/rooms',
        BOOKINGS: '/admin/bookings',
        INVOICES: '/admin/invoices',
        SERVICES: '/admin/services',
        SETTINGS: '/admin/settings',
        HOTELS: '/admin/hotels',
        FLOORS: '/admin/floors',
        SERVICES_BILLS: '/admin/servicesbills',
        SERVICES_BILL_CREATE: '/admin/servicesbills/create',
        SERVICES_BILL_EDIT: '/admin/servicesbills/edit/:id'
    }
};

// Route guards configuration
export const ROUTE_GUARDS = {
    PUBLIC: ['HOME', 'LOGIN', 'REGISTER', 'ROOMS_TARIFF', 'INTRODUCTION', 'GALLERY', 'ROOM_DETAILS', 'ROOM_DETAILS_WITH_ID'],
    PROTECTED: ['DASHBOARD', 'PROFILE', 'SETTINGS', 'ROOMS', 'BOOKINGS', 'BOOKING', 'BOOKING_SUCCESS', 'MY_BOOKINGS', 'MY_INVOICES', 'MY_SERVICES', 'INVOICE_DETAIL', 'SERVICE_DETAIL', 'PAYMENT'],
    ADMIN: ['ADMIN.DASHBOARD', 'ADMIN.USERS', 'ADMIN.ROOMS', 'ADMIN.BOOKINGS', 'ADMIN.INVOICES', 'ADMIN.SERVICES', 'ADMIN.SETTINGS', 'ADMIN.HOTELS', 'ADMIN.FLOORS', 'ADMIN.SERVICES_BILLS']
}; 