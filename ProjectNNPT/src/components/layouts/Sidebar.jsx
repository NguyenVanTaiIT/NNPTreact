import React from 'react';
import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ title = 'Admin Panel' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>{title}</h2>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.DASHBOARD} 
              className={({ isActive }) => isActive ? styles.active : ''}
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.ROOMS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Room Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.USERS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              User Management
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.logout}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  title: PropTypes.string
};

export default Sidebar;