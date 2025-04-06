import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import styles from '../../CSS/UserCSS/Home.module.css';
import banner from '../../../assets/images/photos/banner.jpg';
import room1 from '../../../assets/images/photos/8.jpg';
import room2 from '../../../assets/images/photos/9.jpg';
import room3 from '../../../assets/images/photos/10.jpg';
import tour1 from '../../../assets/images/photos/6.jpg';
import tour2 from '../../../assets/images/photos/3.jpg';
import tour3 from '../../../assets/images/photos/4.jpg';
import food1 from '../../../assets/images/photos/1.jpg';
import food2 from '../../../assets/images/photos/2.jpg';
import food3 from '../../../assets/images/photos/5.jpg';
import Header from '../../layouts/header';
import Footer from '../../layouts/Footer';

function Home() {
  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={banner} className={styles.imgResponsive} alt="slide" />
        <div className={styles.welcomeMessage}>
          <div className={styles.wrapInfo}>
            <div className={styles.information}>
              <h1 className="animate__animated animate__fadeInDown">
                Best hotel in Dubai
              </h1>
              <p className="animate__animated animate__fadeInUp">
                Most luxurious hotel of Asia with the royal treatments and excellent customer service.
              </p>
            </div>
            <a href="#information" className={styles.arrowNav}>
              <i className="fa fa-angle-down"></i>
            </a>
          </div>
        </div>
      </div>

      <div id="information" className={styles.reserveInfo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.colSm7}>
              <div className={styles.embedResponsive}>
                <iframe
                  className={styles.embedResponsiveItem}
                  src="//player.vimeo.com/video/55057393?title=0"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className={styles.colSm5}>
              <h3>Reservation</h3>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className={styles.formControl}
                    placeholder="Enter your name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={styles.formControl}
                    placeholder="Enter your email"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className={styles.formControl}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.row}>
                    <div className={styles.colXs6}>
                      <label htmlFor="rooms">No. of Rooms</label>
                      <select id="rooms" className={styles.formControl}>
                        <option>No. of Rooms</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className={styles.colXs6}>
                      <label htmlFor="adults">No. of Adults</label>
                      <select id="adults" className={styles.formControl}>
                        <option>No. of Adults</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.row}>
                    <div className={styles.colXs4}>
                      <label htmlFor="date">Date</label>
                      <select id="date" className={styles.formControl}>
                        <option>Date</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.colXs4}>
                      <label htmlFor="month">Month</label>
                      <select id="month" className={styles.formControl}>
                        <option>Month</option>
                        {[
                          'Jan (01)', 'Feb (02)', 'Mar (03)', 'Apr (04)', 'May (05)',
                          'June (06)', 'July (07)', 'Aug (08)', 'Sep (09)', 'Oct (10)',
                          'Nov (11)', 'Dec (12)',
                        ].map((month, i) => (
                          <option key={i + 1} value={i + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.colXs4}>
                      <label htmlFor="year">Year</label>
                      <select id="year" className={styles.formControl}>
                        {[...Array(11)].map((_, i) => (
                          <option key={2013 + i} value={2013 + i}>
                            {2013 + i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    className={styles.formControl}
                    placeholder="Your message"
                    rows="4"
                  ></textarea>
                </div>
                <button className={styles.btn}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.services}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.colSm4}>
              <Carousel>
                <Carousel.Item>
                  <img src={room1} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={room2} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={room3} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
              </Carousel>
              <div className={styles.caption}>
                Rooms
                <Link to="/rooms-tariff" className={styles.pullRight}>
                  <i className="fa fa-edit"></i>
                </Link>
              </div>
            </div>

            <div className={styles.colSm4}>
              <Carousel>
                <Carousel.Item>
                  <img src={tour1} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={tour2} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={tour3} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
              </Carousel>
              <div className={styles.caption}>
                Tour Packages
                <Link to="/gallery" className={styles.pullRight}>
                  <i className="fa fa-edit"></i>
                </Link>
              </div>
            </div>
            <div className={styles.colSm4}>
              <Carousel>
                <Carousel.Item>
                  <img src={food1} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={food2} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={food3} className={styles.imgResponsive} alt="slide" />
                </Carousel.Item>
              </Carousel>
              <div className={styles.caption}>
                Food and Drinks
                <Link to="/gallery" className={styles.pullRight}>
                  <i className="fa fa-edit"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;