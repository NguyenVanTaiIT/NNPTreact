import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../CSS/AdminCSS/Dashboard.module.css';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorMessage from '../../utils/ErrorMessage';
import { getRoomStats } from '../../../services/roomService';
import { getUserStats } from '../../../services/userService';

const Dashboard = ({ title = 'Dashboard' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy thống kê từ database
        const [roomStats, userStats] = await Promise.all([
          getRoomStats(),
          getUserStats()
        ]);
        
        console.log('Room stats in Dashboard:', roomStats);
        console.log('User stats in Dashboard:', userStats);
        
        // Kết hợp dữ liệu thống kê
        const combinedStats = {
          totalRooms: roomStats.totalRooms || 0,
          availableRooms: roomStats.availableRooms || 0,
          totalUsers: userStats.totalUsers || 0
        };
        
        console.log('Combined stats:', combinedStats);
        setStats(combinedStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Hiển thị dữ liệu mẫu nếu không có dữ liệu thực
  const displayStats = stats || {
    totalRooms: 0,
    availableRooms: 0,
    totalUsers: 0
  };

  console.log('Display stats:', displayStats);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.dashboard}>
      <h1>{title}</h1>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Rooms</h3>
          <p>{displayStats.totalRooms}</p>
        </div>
        <div className={styles.card}>
          <h3>Available Rooms</h3>
          <p>{displayStats.availableRooms}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Users</h3>
          <p>{displayStats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  title: PropTypes.string
};

export default Dashboard;