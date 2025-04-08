import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from '../../CSS/UserCSS/BookingSuccess.module.css';
import Header from '../../layouts/header';
import Footer from '../../layouts/Footer';

function BookingSuccess() {
  const location = useLocation();
  const { bookingId, roomName, checkInDate, checkOutDate, totalPrice } = location.state || {};

  if (!location.state) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h2>Không tìm thấy thông tin đặt phòng</h2>
            <Link to="/rooms-tariff" className={styles.btn}>
              Quay lại danh sách phòng
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Đặt Phòng Thành Công!</h2>
          
          <div className={styles.bookingDetails}>
            <h3>Thông tin đặt phòng</h3>
            <div className={styles.detailItem}>
              <span>Mã đặt phòng:</span>
              <span>{bookingId}</span>
            </div>
            <div className={styles.detailItem}>
              <span>Tên phòng:</span>
              <span>{roomName}</span>
            </div>
            <div className={styles.detailItem}>
              <span>Ngày check-in:</span>
              <span>{new Date(checkInDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className={styles.detailItem}>
              <span>Ngày check-out:</span>
              <span>{new Date(checkOutDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className={styles.detailItem}>
              <span>Tổng tiền:</span>
              <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/rooms-tariff" className={styles.btnSecondary}>
              Quay lại danh sách phòng
            </Link>
            <Link to="/my-bookings" className={styles.btnPrimary}>
              Xem đơn đặt phòng của tôi
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookingSuccess; 