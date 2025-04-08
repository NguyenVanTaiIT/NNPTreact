import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../CSS/UserCSS/RoomsTariff.module.css';
import room1 from '../../../assets/images/photos/8.jpg';
import room2 from '../../../assets/images/photos/9.jpg';
import room3 from '../../../assets/images/photos/10.jpg';
import room4 from '../../../assets/images/photos/11.jpg';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';
import { getAllRooms } from '../../../services/roomService';
import LoadingSpinner from '../../utils/LoadingSpinner';

function RoomsTariff() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Số phòng hiển thị trên mỗi trang
  const roomsPerPage = 6;
  
  // Hàm lấy dữ liệu phòng từ MongoDB
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Không thể tải dữ liệu phòng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  // Tính toán phòng hiển thị trên trang hiện tại
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  
  // Tính tổng số trang
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  
  // Hàm lấy ảnh ngẫu nhiên cho phòng
  const getRandomRoomImage = () => {
    const images = [room1, room2, room3, room4];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Rooms & Tariff</h2>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Đang tải dữ liệu phòng...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className={styles.row}>
              {currentRooms.map((room) => (
                <div key={room._id} className={styles.colSm6}>
                  <div className={styles.rooms}>
                    <img 
                      src={getRandomRoomImage()} 
                      className={styles.imgResponsive} 
                      alt={room.name} 
                    />
                    <div className={styles.info}>
                      <h3>{room.name}</h3>
                      <p>
                        {room.type} - {room.price.toLocaleString('vi-VN')} VNĐ/đêm
                      </p>
                      <p>
                        {room.amenities && room.amenities.length > 0 
                          ? `Tiện nghi: ${room.amenities.join(', ')}` 
                          : 'Phòng tiêu chuẩn với đầy đủ tiện nghi'}
                      </p>
                      <Link to={`/room-details/${room._id}`} className={styles.btn}>
                        Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.textCenter}>
                <ul className={styles.pagination}>
                  <li className={currentPage === 1 ? styles.disabled : ''}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}>«</a>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={currentPage === page ? styles.active : ''}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}>
                        {page} {currentPage === page && <span className={styles.srOnly}>(current)</span>}
                      </a>
                    </li>
                  ))}
                  <li className={currentPage === totalPages ? styles.disabled : ''}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}>»</a>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default RoomsTariff;