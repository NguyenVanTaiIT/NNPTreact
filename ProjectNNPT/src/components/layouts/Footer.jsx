import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../CSS/UserCSS/Footer.module.css';

function Footer({ 
  title = 'Holiday Crown',
  description = 'Holiday Crown was these three and songs arose whose. Of in vicinity contempt together in possible branched. Assured company hastily looking garrets in oh. Most have love my gone to this so. Discovered interested prosperous the our affronting insipidity day. Missed lovers way one vanity wishes nay but. Use shy seemed within twenty wished old few regret passed. Absolute one hastened mrs any sensible.'
}) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.spacer}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.colSm5}>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>

          <div className={styles.colSm3}>
            <h4>Quick Links</h4>
            <ul className={styles.listUnstyled}>
              <li><Link to="/rooms-tariff">Rooms & Tariff</Link></li>
              <li><Link to="/introduction">Introduction</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/tour">Tour Packages</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.colSm4}>
            <h4>Subscription</h4>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Enter email id here"
              />
              <span className={styles.inputGroupBtn}>
                <button className={styles.btn} type="button">
                  Get Notify
                </button>
              </span>
            </div>
            <div className={styles.social}>
              <a href="#" title="facebook">
                <i className="fa-brands fa-square-facebook" />
              </a>
              <a href="#" title="instagram">
                <i className="fa-brands fa-square-instagram" />
              </a>
              <a href="#" title="twitter">
                <i className="fa-brands fa-square-x-twitter" />
              </a>
              <a href="#" title="pinterest">
                <i className="fa-brands fa-square-pinterest" />
              </a>
              <a href="#" title="youtube">
                <i className="fa-brands fa-square-youtube" />
              </a>
            </div>
          </div>
        </div>
      </div>


      <button className={styles.toTop} onClick={handleScrollToTop}>
        <i className="fa fa-angle-up"></i>
      </button>
    </footer>
  );
}

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default Footer;