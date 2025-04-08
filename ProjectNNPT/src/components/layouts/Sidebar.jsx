import React from 'react';
import PropTypes from 'prop-types';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logoNode.jpg';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="TRIDZ Logo" className={styles.logoImage} />
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
              to={ROUTES.ADMIN.HOTELS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Hotel Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.FLOORS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Floor Management
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
          <li>
            <NavLink 
              to={ROUTES.ADMIN.BOOKINGS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Booking Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.INVOICES} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Invoice Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.SERVICES} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Service Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={ROUTES.ADMIN.SERVICES_BILLS} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Service Bills
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