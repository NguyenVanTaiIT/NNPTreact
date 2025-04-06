import React from 'react';
import styles from '../../CSS/UserCSS/Gallery.module.css';
import img1 from '../../../assets/images/photos/1.jpg';
import img2 from '../../../assets/images/photos/2.jpg';
import img3 from '../../../assets/images/photos/3.jpg';
import img4 from '../../../assets/images/photos/4.jpg';
import img5 from '../../../assets/images/photos/5.jpg';
import img6 from '../../../assets/images/photos/6.jpg';
import img7 from '../../../assets/images/photos/7.jpg';
import img8 from '../../../assets/images/photos/8.jpg';
import img9 from '../../../assets/images/photos/9.jpg';
import img11 from '../../../assets/images/photos/11.jpg';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';

function Gallery() {
  const images = [
    { src: img1, title: 'Foods' },
    { src: img2, title: 'Coffee' },
    { src: img3, title: 'Travel' },
    { src: img4, title: 'Adventure' },
    { src: img5, title: 'Fruits' },
    { src: img6, title: 'Summer' },
    { src: img7, title: 'Bathroom' },
    { src: img8, title: 'Rooms' },
    { src: img9, title: 'Big Room' },
    { src: img11, title: 'Living Room' },
    { src: img1, title: 'Fruits' },
    { src: img3, title: 'Travel' },
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Gallery</h1>
        <div className={styles.row}>
          {images.map((image, index) => (
            <div key={index} className={styles.colSm4}>
              <a href={image.src} title={image.title} className={styles.galleryImage} data-gallery>
                <img src={image.src} className={styles.imgResponsive} alt={image.title} />
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* Blueimp Gallery Lightbox Container */}
      <div id="blueimp-gallery" className="blueimp-gallery blueimp-gallery-controls">
        <div className="slides"></div>
        <h3 className="title"></h3>
        <a className="prev">‹</a>
        <a className="next">›</a>
        <a className="close">×</a>
      </div>
      <Footer />
    </>
  );
}

export default Gallery;