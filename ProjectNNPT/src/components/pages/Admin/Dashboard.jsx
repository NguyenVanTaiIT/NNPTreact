import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../CSS/AdminCSS/Dashboard.module.css';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorMessage from '../../utils/ErrorMessage';
import { getRoomStats } from '../../../services/roomService';
import { getUserStats } from '../../../services/userService';

const Dashboard = ({ title = 'Trang quản trị' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Đang tải thống kê trang quản trị...');
        
        const [roomStats, userStats] = await Promise.all([
          getRoomStats(),
          getUserStats()
        ]);
        
        console.log('Thống kê phòng:', roomStats);
        console.log('Thống kê người dùng:', userStats);
        
        const combinedStats = {
          totalRooms: roomStats.totalRooms || 0,
          availableRooms: roomStats.availableRooms || 0,
          totalUsers: userStats.totalUsers || 0
        };
        
        console.log('Tổng hợp thống kê:', combinedStats);
        setStats(combinedStats);
      } catch (err) {
        console.error('Lỗi khi tải thống kê:', err);
        setError(err.message || 'Không thể tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = stats || {
    totalRooms: 0,
    availableRooms: 0,
    totalUsers: 0
  };

  console.log('Thống kê hiển thị:', displayStats);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.dashboard}>
      <h1>{title}</h1>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Tổng số phòng</h3>
          <p>{displayStats.totalRooms}</p>
        </div>
        <div className={styles.card}>
          <h3>Phòng còn trống</h3>
          <p>{displayStats.availableRooms}</p>
        </div>
        <div className={styles.card}>
          <h3>Tổng số người dùng</h3>
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
