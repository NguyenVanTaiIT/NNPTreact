import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Topbar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import profileImage from '../../assets/images/profile-user.png';

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('Trang quản trị');

  // Route mapping for breadcrumb labels
  const routeLabels = {
    [ROUTES.ADMIN.DASHBOARD]: 'Trang quản trị',
    [ROUTES.ADMIN.USERS]: 'Quản lý người dùng',
    [ROUTES.ADMIN.ROOMS]: 'Quản lý phòng',
    [ROUTES.ADMIN.BOOKINGS]: 'Quản lý đặt phòng',
    [ROUTES.ADMIN.INVOICES]: 'Quản lý hóa đơn',
    [ROUTES.ADMIN.SERVICES]: 'Quản lý dịch vụ',
    [ROUTES.ADMIN.SETTINGS]: 'Cài đặt hệ thống',
    [ROUTES.ADMIN.HOTELS]: 'Quản lý khách sạn',
    [ROUTES.ADMIN.FLOORS]: 'Quản lý tầng'
  };

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname;
    
    // Exact match first for the current path
    if (routeLabels[path]) {
      setCurrentPage(routeLabels[path]);
      return;
    }
    
    // Check for partial matches (for detail pages)
    for (const [route, label] of Object.entries(routeLabels)) {
      // Check if current path starts with a route prefix
      if (path.startsWith(`${route}/`)) {
        setCurrentPage(label);
        return;
      }
    }
    
    // Special case handling for specific paths
    if (path === '/admin/hotels') {
      setCurrentPage('Quản lý khách sạn');
    } else if (path === '/admin/users') {
      setCurrentPage('Quản lý người dùng');
    } else if (path === '/admin/rooms') {
      setCurrentPage('Quản lý phòng');
    } else if (path === '/admin/bookings') {
      setCurrentPage('Quản lý đặt phòng');
    } else if (path === '/admin/invoices') {
      setCurrentPage('Quản lý hóa đơn');
    } else if (path === '/admin/services') {
      setCurrentPage('Quản lý dịch vụ');
    } else if (path === '/admin/settings') {
      setCurrentPage('Cài đặt hệ thống');
    } else if (path === '/admin/floors') {
      setCurrentPage('Quản lý tầng');
    } else if (path === '/admin') {
      setCurrentPage('Dashboard');
    } else if (path.includes('/admin/')) {
      setCurrentPage('Admin'); // Default for unmatched admin routes
    } else {
      setCurrentPage('Dashboard'); // Default fallback
    }
    
    // Debug logs (có thể bỏ khi product)
    console.log('Current path:', path);
    console.log('Updated breadcrumb:', currentPage);
  }, [location.pathname]);

  // Lấy chữ cái đầu tiên của tên người dùng
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Hàm lấy tên role
  const getRoleName = (role) => {
    if (!role) return 'User';
    if (typeof role === 'string') return role;
    return role.roleName || 'User';
  };

  // Determine if current route is an admin route
  const isAdminRoute = () => {
    return location.pathname.startsWith('/admin');
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.leftSection}>
        <Link to={ROUTES.HOME} className={styles.homeButton}>
          <i className="fas fa-home"></i> Trang chủ
        </Link>
        <div className={styles.breadcrumbs}>
          <span>Admin</span>
          <i className="fas fa-chevron-right"></i>
          <span>{currentPage}</span>
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.icons}>
          <div className={styles.iconWrapper}>
            <i className="fas fa-bell"></i>
            <span className={styles.badge}>3</span>
          </div>
          <div className={styles.iconWrapper}>
            <i className="fas fa-envelope"></i>
            <span className={styles.badge}>5</span>
          </div>
        </div>
        
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>{getRoleName(user?.role)}</span>
          </div>
          <div className={styles.avatar}>
            <img src={profileImage} alt="Admin Profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

Topbar.propTypes = {
  userName: PropTypes.string,
  userInitials: PropTypes.string
};

export default Topbar;