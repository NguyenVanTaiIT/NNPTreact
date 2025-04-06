import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../CSS/UserCSS/RoomsTariff.module.css';
import room1 from '../../../assets/images/photos/8.jpg';
import room2 from '../../../assets/images/photos/9.jpg';
import room3 from '../../../assets/images/photos/10.jpg';
import room4 from '../../../assets/images/photos/11.jpg';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';

function RoomsTariff() {
  const [currentPage, setCurrentPage] = useState(1);
  const rooms = [
    { img: room1 }, { img: room2 }, { img: room3 }, { img: room4 },
    { img: room2 }, { img: room1 }, { img: room3 }, { img: room4 },
    { img: room2 }, { img: room1 }, { img: room4 }, { img: room3 },
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Rooms & Tariff</h2>
        <div className={styles.row}>
          {rooms.map((room, index) => (
            <div key={index} className={styles.colSm6}>
              <div className={styles.rooms}>
                <img src={room.img} className={styles.imgResponsive} alt="room" />
                <div className={styles.info}>
                  <h3>Luxirious Suites</h3>
                  <p>
                    Missed lovers way one vanity wishes nay but. Use shy seemed within twenty wished old few regret passed. Absolute one hastened mrs any sensible
                  </p>
                  <Link to="/room-details" className={styles.btn}>
                    Check Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.textCenter}>
          <ul className={styles.pagination}>
            <li className={currentPage === 1 ? styles.disabled : ''}>
              <a href="#" onClick={() => setCurrentPage(currentPage - 1)}>«</a>
            </li>
            {[1, 2, 3, 4, 5].map((page) => (
              <li key={page} className={currentPage === page ? styles.active : ''}>
                <a href="#" onClick={() => setCurrentPage(page)}>
                  {page} {currentPage === page && <span className={styles.srOnly}>(current)</span>}
                </a>
              </li>
            ))}
            <li>
              <a href="#" onClick={() => setCurrentPage(currentPage + 1)}>»</a>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RoomsTariff;