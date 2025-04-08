import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../components/CSS/AdminCSS/Hotels.module.css';
import { getAllHotels, createHotel, updateHotel, deleteHotel } from '../../../services/hotelService';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    rating: 3
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getAllHotels();
      setHotels(data);
      setError(null);
    } catch (err) {
      setError('Failed to load hotels. Please try again.');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedHotel) {
        await updateHotel(selectedHotel._id, formData);
      } else {
        await createHotel(formData);
      }
      fetchHotels();
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        rating: 3
      });
      setSelectedHotel(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      contactNumber: hotel.contactNumber,
      email: hotel.email,
      rating: hotel.rating
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) {
      try {
        await deleteHotel(id);
        fetchHotels();
      } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa khách sạn');
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Quản lý Khách sạn</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>{isEditing ? 'Cập nhật Khách sạn' : 'Thêm Khách sạn mới'}</h3>
        
        <div className={styles.formGroup}>
          <label>Tên khách sạn:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Đánh giá (1-5):</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedHotel(null);
                setFormData({
                  name: '',
                  address: '',
                  contactNumber: '',
                  email: '',
                  rating: 3
                });
              }}
              className={styles.cancelButton}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className={styles.hotelsList}>
        <h3>Danh sách Khách sạn</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel._id}>
                <td>{hotel.name}</td>
                <td>{hotel.address}</td>
                <td>{hotel.contactNumber}</td>
                <td>{hotel.email}</td>
                <td>{hotel.rating}</td>
                <td>
                  <button
                    onClick={() => handleEdit(hotel)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hotels; 