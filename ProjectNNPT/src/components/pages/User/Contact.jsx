import React from 'react';
import styles from '../CSS/Contact.module.css';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/header';

function Contact() {
  return (
    <>
      <Header />                           
      <div className={styles.container}>
        <h1 className={styles.title}>Contact</h1>
        <div className={styles.contact}>
          <div className={styles.row}>
            <div className={styles.colSm12}>
              <div className={styles.map}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9933.460884430251!2d-0.13301252240929382!3d51.50651527467666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C+UK!5e0!3m2!1sen!2snp!4v1414314152341"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  title="Google Map"
                ></iframe>
              </div>

              <div className={styles.formContainer}>
                <div className={styles.spacer}>
                  <h4>Write to us</h4>
                  <form role="form">
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        className={styles.formControl}
                        id="name"
                        placeholder="Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        className={styles.formControl}
                        id="email"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="tel"
                        className={styles.formControl}
                        id="phone"
                        placeholder="Phone"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <textarea
                        className={styles.formControl}
                        placeholder="Message"
                        rows="4"
                      ></textarea>
                    </div>
                    <button type="submit" className={styles.btn}>
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;