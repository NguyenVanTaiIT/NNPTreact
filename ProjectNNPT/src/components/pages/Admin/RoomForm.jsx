import React, { useState, useEffect } from 'react';
import styles from '../../CSS/AdminCSS/RoomForm.module.css';
import Button from '../../common/Button';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Standard',
    capacity: 2,
    price: 0,
    description: '',
    amenities: '',
    isAvailable: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        type: room.type || 'Standard',
        capacity: room.capacity || 2,
        price: room.price || 0,
        description: room.description || '',
        amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true
      });
    }
  }, [room]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Room type is required';
    }
    
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert amenities string to array and clean up the data
      const submissionData = {
        ...formData,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
      };
      onSubmit(submissionData);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{room ? 'Edit Room' : 'Add New Room'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className={errors.roomNumber ? styles.error : ''}
            />
            {errors.roomNumber && <span className={styles.errorText}>{errors.roomNumber}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Room Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? styles.error : ''}
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Capacity (persons)</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className={errors.capacity ? styles.error : ''}
            />
            {errors.capacity && <span className={styles.errorText}>{errors.capacity}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Price (VND)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="10000"
              className={errors.price ? styles.error : ''}
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Amenities (comma-separated)</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              rows="2"
              placeholder="TV, Air Conditioning, Mini Bar, etc."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Room is available
            </label>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {room ? 'Update Room' : 'Create Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;