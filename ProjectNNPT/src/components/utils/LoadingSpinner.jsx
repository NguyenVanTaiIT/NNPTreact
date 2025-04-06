import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className={styles['loading-spinner-container']}>
            <div className={styles['loading-spinner']}></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner; 