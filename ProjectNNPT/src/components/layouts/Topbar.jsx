import React from 'react';
import PropTypes from 'prop-types';
import styles from './Topbar.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import profileImage from '../../assets/images/profile-user.png';

const Topbar = () => {
  const { user } = useAuth();
  
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

  return (
    <div className={styles.topbar}>
      <div className={styles.leftSection}>
        <Link to={ROUTES.HOME} className={styles.homeButton}>
          <i className="fas fa-home"></i> Website
        </Link>
        <div className={styles.search}>
          <input type="text" placeholder="Search..." />
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
  );
};

Topbar.propTypes = {
  userName: PropTypes.string,
  userInitials: PropTypes.string
};

export default Topbar;