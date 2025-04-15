import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../CSS/UserCSS/Header.module.css';
import { useAuth } from '../../contexts/AuthContext';
import profileIcon from '../../assets/images/profile-user.png';
import logoNode from '../../assets/images/logoNode.jpg';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get role name
  const getRoleName = (role) => {
    if (!role) return 'User';
    if (typeof role === 'string') return role;
    return role.roleName || 'User';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logoContainer}>
          <img src={logoNode} alt="Hotel Logo" className={styles.logo} />
        </NavLink>
        
        <nav className={styles.mainNav}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/rooms-tariff"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Rooms & Tariff
          </NavLink>
          <NavLink
            to="/introduction"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Introduction
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Gallery
          </NavLink>
          {user?.role === 'Admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Admin Panel
            </NavLink>
          )}
        </nav>
        
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userInfoContainer} ref={dropdownRef}>
              <div className={styles.userInfo} onClick={toggleDropdown}>
                <div className={styles.avatar}>
                  <img src={profileIcon} alt="profile" />
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{user.username || 'User'}</span>
                  <span className={styles.userRole}>{getRoleName(user.role)}</span>
                </div>
              </div>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <NavLink to="/profile" className={styles.dropdownItem}>
                    <i className="fas fa-user"></i> Hồ sơ của tôi
                  </NavLink>
                  <NavLink to="/my-bookings" className={styles.dropdownItem}>
                    <i className="fas fa-calendar-check"></i> Đơn đặt phòng của tôi
                  </NavLink>
                  <NavLink to="/my-invoices" className={styles.dropdownItem}>
                    <i className="fas fa-file-invoice"></i> Hóa đơn của tôi
                  </NavLink>
                  <NavLink to="/my-services" className={styles.dropdownItem}>
                    <i className="fas fa-concierge-bell"></i> Dịch vụ đã đăng ký
                  </NavLink>
                  <div className={styles.dropdownDivider}></div>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={styles.loginButton}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;