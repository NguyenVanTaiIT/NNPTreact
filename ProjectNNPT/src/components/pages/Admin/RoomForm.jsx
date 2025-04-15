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
        console.error('Lỗi khi tải danh sách khách sạn và tầng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsAndFloors();
  }, []);

  useEffect(() => {
    if (room) {
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
    }
  }, [room]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên phòng không được để trống';
    if (!formData.type.trim()) newErrors.type = 'Loại phòng không được để trống';
    if (formData.price < 0) newErrors.price = 'Giá không được âm';
    if (!formData.hotel) newErrors.hotel = 'Vui lòng chọn khách sạn';
    if (!formData.floor) newErrors.floor = 'Vui lòng chọn tầng';
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
      setIsSubmitting(true);
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean)
      };
      try {
        onSubmit(submissionData);
      } catch (error) {
        console.error('Lỗi khi gửi biểu mẫu:', error);
        setIsSubmitting(false);
      }
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{room ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tên phòng</label>
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
            <label>Loại phòng</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? styles.error : ''}
            >
              <option value="Standard">Tiêu chuẩn</option>
              <option value="Deluxe">Cao cấp</option>
              <option value="Suite">Suite</option>
              <option value="Family">Gia đình</option>
              <option value="Premium">Thượng hạng</option>
              <option value="Executive">Executive</option>
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Giá phòng (VND)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1"
              className={errors.price ? styles.error : ''}
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Khách sạn</label>
            <select
              name="hotel"
              value={formData.hotel}
              onChange={handleChange}
              className={errors.hotel ? styles.error : ''}
            >
              <option value="">Chọn khách sạn</option>
              {hotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            {errors.hotel && <span className={styles.errorText}>{errors.hotel}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Tầng</label>
            <select
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className={errors.floor ? styles.error : ''}
            >
              <option value="">Chọn tầng</option>
              {floors.map(floor => (
                <option key={floor._id} value={floor._id}>
                  {floor.name}
                </option>
              ))}
            </select>
            {errors.floor && <span className={styles.errorText}>{errors.floor}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tiện nghi (phân cách bằng dấu phẩy)</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              rows="2"
              placeholder="TV, Máy lạnh, Mini Bar, v.v."
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
              Phòng còn trống
            </label>
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : (room ? 'Cập nhật phòng' : 'Tạo phòng')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
