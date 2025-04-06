import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../CSS/UserCSS/Header.module.css';
import { useAuth } from '../../contexts/AuthContext';
import profileIcon from '../../assets/images/profile-user.png';
import Logo3FS from '../common/Logo3FS';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <img src={profileIcon} alt="profile" />
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{user.username}</span>
                      <span className={styles.userRole}>{getRoleName(user.role)}</span>
                      <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                      </button>
                    </div>
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