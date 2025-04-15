import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../../CSS/UserCSS/RoomDetails.module.css';
import room1 from '../../../assets/images/photos/8.jpg';
import room2 from '../../../assets/images/photos/9.jpg';
import room3 from '../../../assets/images/photos/10.jpg';
import room4 from '../../../assets/images/photos/11.jpg';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';
import { getRoomById } from '../../../services/roomService';
import LoadingSpinner from '../../utils/LoadingSpinner';

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hàm lấy dữ liệu phòng từ MongoDB
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const data = await getRoomById(id);
        setRoom(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError('Không thể tải thông tin phòng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);
  
  // Hàm lấy ảnh ngẫu nhiên cho phòng
  const getRandomRoomImage = () => {
    const images = [room1, room2, room3, room4];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Chi Tiết Phòng</h2>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Đang tải thông tin phòng...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <Link to="/rooms-tariff" className={styles.btn}>
              Quay Lại Danh Sách Phòng
            </Link>
          </div>
        ) : room ? (
          <div className={styles.roomDetails}>
            <div className={styles.roomImage}>
              <img src={getRandomRoomImage()} alt={room.name} />
            </div>
            <div className={styles.roomInfo}>
              <h3>{room.name}</h3>
              <div className={styles.roomType}>
                <span>Loại phòng:</span> {room.type}
              </div>
              <div className={styles.roomPrice}>
                <span>Giá:</span> {room.price.toLocaleString('vi-VN')} VNĐ/đêm
              </div>
              <div className={styles.roomStatus}>
                <span>Trạng thái:</span> {room.isAvailable ? 'Còn trống' : 'Đã đặt'}
              </div>
              {room.amenities && room.amenities.length > 0 && (
                <div className={styles.roomAmenities}>
                  <span>Tiện nghi:</span>
                  <ul>
                    {room.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.roomActions}>
                <Link to="/rooms-tariff" className={styles.btnSecondary}>
                  Quay Lại
                </Link>
                {room.isAvailable && (
                  <Link to={`/bookings/${room._id}`} className={styles.btnPrimary}>
                    Đặt Phòng
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <p>Không tìm thấy thông tin phòng</p>
            <Link to="/rooms-tariff" className={styles.btn}>
              Quay Lại Danh Sách Phòng
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default RoomDetails;