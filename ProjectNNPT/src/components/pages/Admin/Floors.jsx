import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../components/CSS/AdminCSS/Floors.module.css';
import { getAllFloors, createFloor, updateFloor, deleteFloor } from '../../../services/floorService';
import { getAllHotels } from '../../../services/hotelService';

const Floors = () => {
  const [floors, setFloors] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    floorNumber: 0,
    hotel: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFloors();
    fetchHotels();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const data = await getAllFloors();
      setFloors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load floors. Please try again.');
      console.error('Error fetching floors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const data = await getAllHotels();
      setHotels(data);
    } catch (err) {
      console.error('Error fetching hotels:', err);
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
      if (selectedFloor) {
        await updateFloor(selectedFloor._id, formData);
      } else {
        await createFloor(formData);
      }
      fetchFloors();
      setFormData({
        name: '',
        description: '',
        floorNumber: 0,
        hotel: ''
      });
      setSelectedFloor(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (floor) => {
    setSelectedFloor(floor);
    setFormData({
      name: floor.name,
      description: floor.description,
      floorNumber: floor.floorNumber,
      hotel: floor.hotel._id
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tầng này?')) {
      try {
        await deleteFloor(id);
        fetchFloors();
      } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa tầng');
      }
    }
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h._id === hotelId);
    return hotel ? hotel.name : 'Không xác định';
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Quản lý Tầng</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>{isEditing ? 'Cập nhật Tầng' : 'Thêm Tầng mới'}</h3>
        
        <div className={styles.formGroup}>
          <label>Tên tầng:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Số tầng:</label>
          <input
            type="number"
            name="floorNumber"
            value={formData.floorNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Khách sạn:</label>
          <select
            name="hotel"
            value={formData.hotel}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn khách sạn</option>
            {hotels.map(hotel => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
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
                setSelectedFloor(null);
                setFormData({
                  name: '',
                  description: '',
                  floorNumber: 0,
                  hotel: ''
                });
              }}
              className={styles.cancelButton}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className={styles.floorsList}>
        <h3>Danh sách Tầng</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Số tầng</th>
              <th>Khách sạn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {floors.map(floor => (
              <tr key={floor._id}>
                <td>{floor.name}</td>
                <td>{floor.description}</td>
                <td>{floor.floorNumber}</td>
                <td>{getHotelName(floor.hotel._id)}</td>
                <td>
                  <button
                    onClick={() => handleEdit(floor)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(floor._id)}
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

export default Floors; 