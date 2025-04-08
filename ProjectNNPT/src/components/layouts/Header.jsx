import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../CSS/UserCSS/Header.module.css';
import { useAuth } from '../../contexts/AuthContext';
import profileIcon from '../../assets/images/profile-user.png';
import Logo3FS from '../common/Logo3FS';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hàm lấy tên role
  const getRoleName = (role) => {
    if (!role) return 'User';
    if (typeof role === 'string') return role;
    return role.roleName || 'User';
  };

  // Đóng dropdown khi click bên ngoài
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
    <div id="home">
      <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.navbar}`} role="navigation">
        <div className={`container ${styles.container}`}>
          <NavLink className={`navbar-brand ${styles.navbarBrand}`} to="/">
            <Logo3FS />
          </NavLink>
          <button
            className={`navbar-toggler ${styles.navbarToggler}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#bs-example-navbar-collapse-1"
            aria-controls="bs-example-navbar-collapse-1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className={`navbar-nav ms-auto ${styles.navbarNav}`}>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? styles.active : ''}`
                  }
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? styles.active : ''}`
                  }
                  to="/rooms-tariff"
                >
                  Rooms & Tariff
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? styles.active : ''}`
                  }
                  to="/introduction"
                >
                  Introduction
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? styles.active : ''}`
                  }
                  to="/gallery"
                >
                  Gallery
                </NavLink>
              </li>
              {user?.role === 'Admin' && (
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? styles.active : ''}`
                    }
                    to="/admin"
                  >
                    Admin Panel
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                {user ? (
                  <div className={styles.userInfoContainer} ref={dropdownRef}>
                    <div className={styles.userInfo} onClick={toggleDropdown}>
                      <div className={styles.avatar}>
                        <img src={profileIcon} alt="profile" />
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{user.username}</span>
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
                    className={({ isActive }) =>
                      `nav-link ${isActive ? styles.active : ''}`
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

Header.propTypes = {
  logoAlt: PropTypes.string
};

export default Header;