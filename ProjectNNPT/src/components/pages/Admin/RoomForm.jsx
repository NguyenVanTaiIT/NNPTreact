import React, { useState, useEffect } from 'react';
import styles from '../../CSS/AdminCSS/RoomForm.module.css';
import Button from '../../common/Button';
import { getAllHotels, getAllFloors } from '../../../services/roomService';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    price: 0,
    description: '',
    amenities: '',
    isAvailable: true,
    hotel: '',
    floor: ''
  });

  const [errors, setErrors] = useState({});
  const [hotels, setHotels] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHotelsAndFloors = async () => {
      try {
        setLoading(true);
        const hotelsData = await getAllHotels();
        setHotels(hotelsData);

        const floorsData = await getAllFloors();
        setFloors(floorsData);
      } catch (error) {
        console.error('Error fetching hotels and floors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsAndFloors();
  }, []);

  useEffect(() => {
    if (room) {
      console.log('Setting form data from room:', room);
      setFormData({
        name: room.name || '',
        type: room.type || 'Standard',
        price: room.price || 0,
        description: room.description || '',
        amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
        hotel: room.hotel?._id || '',
        floor: room.floor?._id || ''
      });
    } else {
      console.log('No room provided, using default form data');
    }
  }, [room]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Room type is required';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (!formData.hotel) {
      newErrors.hotel = 'Hotel is required';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor is required';
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
    console.log('Form submitted, validating...');
    
    if (validateForm()) {
      console.log('Form is valid, preparing submission data');
      setIsSubmitting(true);
      
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
      };
      
      console.log('Submitting data:', submissionData);
      console.log('Room object:', room);
      
      try {
        onSubmit(submissionData);
      } catch (error) {
        console.error('Error in form submission:', error);
        setIsSubmitting(false);
      }
    } else {
      console.log('Form validation failed:', errors);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{room ? 'Edit Room' : 'Add New Room'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Room Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.error : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
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
              <option value="Premium">Premium</option>
              <option value="Executive">Executive</option>
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type}</span>}
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
            <label>Hotel</label>
            <select
              name="hotel"
              value={formData.hotel}
              onChange={handleChange}
              className={errors.hotel ? styles.error : ''}
            >
              <option value="">Select a hotel</option>
              {hotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            {errors.hotel && <span className={styles.errorText}>{errors.hotel}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Floor</label>
            <select
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className={errors.floor ? styles.error : ''}
            >
              <option value="">Select a floor</option>
              {floors.map(floor => (
                <option key={floor._id} value={floor._id}>
                  {floor.name}
                </option>
              ))}
            </select>
            {errors.floor && <span className={styles.errorText}>{errors.floor}</span>}
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
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : (room ? 'Update Room' : 'Create Room')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;