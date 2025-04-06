import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDialog; 