import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import styles from '../../CSS/UserCSS/RoomDetails.module.css';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorMessage from '../../utils/ErrorMessage';
import { getRoomById } from '../../../services/roomService';

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const roomData = await getRoomById(id);
        setRoom(roomData);
        setError(null);
      } catch (err) {
        setError('Không thể tải thông tin phòng');
        console.error('Error fetching room details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!room) {
    return <ErrorMessage message="Không tìm thấy phòng" onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>{room.name}</h1>

        <div id="RoomDetails" className={styles.carousel}>
          <Carousel>
            {room.images && room.images.map((img, index) => (
              <Carousel.Item key={index}>
                <img src={img} className={styles.imgResponsive} alt={`slide ${index + 1}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className={styles.roomFeatures}>
          <div className={styles.row}>
            <div className={styles.colSm12}>
              <p>{room.description}</p>
              <p>
                By Learning Ways To Become Peaceful. One of the greatest barriers to making the sale is your prospect's natural. Don't stubbornly. Don't stubbornly. Don't stubbornly. -And Gain Power By Learning Ways To Become Peaceful.
              </p>
            </div>
            <div className={styles.colSm6}>
              <h3>Amenities</h3>
              <ul>
                {room.amenities && room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
            <div className={styles.colSm3}>
              <div className={styles.sizePrice}>
                Size<span>{room.size}</span>
              </div>
            </div>
            <div className={styles.colSm3}>
              <div className={styles.sizePrice}>
                Price<span>{room.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RoomDetails;