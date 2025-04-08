import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../components/CSS/AdminCSS/Bookings.module.css';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getAllBookings, updateBookingStatus } from '../../../services/bookingService.jsx';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching bookings...');
      const response = await getAllBookings();
      console.log('Bookings response:', response);
      
      // Kiểm tra nếu response là array trực tiếp
      if (Array.isArray(response)) {
        console.log('Setting bookings from array:', response);
        setBookings(response);
        setError(null);
      }
      // Kiểm tra nếu response là object có data
      else if (response && response.data && Array.isArray(response.data)) {
        console.log('Setting bookings from response.data:', response.data);
        setBookings(response.data);
        setError(null);
      }
      // Trường hợp response không hợp lệ
      else {
        console.error('Invalid response format:', response);
        setError('Không thể tải danh sách đặt phòng - Dữ liệu không hợp lệ');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      if (response && response.success) {
        // Refresh bookings list
        await fetchBookings();
      } else {
        setError('Không thể cập nhật trạng thái đặt phòng');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Không thể cập nhật trạng thái đặt phòng. Vui lòng thử lại sau.');
    }
  };

  // Ensure bookings is an array before filtering
  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  }) : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải danh sách đặt phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản Lý Đặt Phòng</h2>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ xác nhận
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'confirmed' ? styles.active : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Đã xác nhận
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'canceled' ? styles.active : ''}`}
            onClick={() => setFilter('canceled')}
          >
            Đã hủy
          </button>
        </div>
      </div>

      <div className={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không có đơn đặt phòng nào.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingInfo}>
                  <h3>Đặt phòng #{booking._id.slice(-6)}</h3>
                  <span className={`${styles.status} ${styles[booking.status]}`}>
                    {booking.status === 'pending' ? 'Chờ xác nhận' :
                     booking.status === 'confirmed' ? 'Đã xác nhận' :
                     'Đã hủy'}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <p>Người đặt: {booking.userId?.fullName || booking.userId?.username || 'Không có tên'}</p>
                  <p>Email: {booking.userId?.email || 'Không có email'}</p>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <span>Phòng:</span>
                  <span>{booking.roomId?.name || 'Không có thông tin phòng'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Ngày nhận phòng:</span>
                  <span>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Ngày trả phòng:</span>
                  <span>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className={styles.bookingActions}>
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking._id, 'confirmed')}
                      className={styles.btnConfirm}
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking._id, 'canceled')}
                      className={styles.btnCancel}
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings; 