import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className={styles['error-message-container']}>
            <div className={styles['error-icon']}>⚠️</div>
            <p className={styles['error-text']}>{message}</p>
            {onRetry && (
                <button className={styles['retry-button']} onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage; 