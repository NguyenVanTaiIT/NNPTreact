import React, { useState } from 'react';
import styles from '../../CSS/AdminCSS/RoomList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';

const RoomList = ({ rooms, onDelete, onEdit, onCreate }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleEdit = (room) => {
    console.log('Chỉnh sửa phòng:', room);
    onEdit(room);
  };

  const handleDeleteClick = (roomId) => {
    setSelectedRoomId(roomId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (selectedRoomId) {
      onDelete(selectedRoomId);
      setShowConfirmDelete(false);
      setSelectedRoomId(null);
    }
  };

  const getStatusClass = (isAvailable) => {
    return isAvailable ? styles.available : styles.occupied;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={styles.roomList}>
      <div className={styles.header}>
        <h2>Quản lý phòng</h2>
        <Button variant="success" onClick={onCreate}>
          Thêm phòng mới
        </Button>
      </div>

      <Table 
        headers={[
          'Tên phòng', 
          'Tầng',
          'Khách sạn',
          'Giá', 
          'Trạng thái', 
          'Hành động'
        ]}
      >
        {rooms.map((room) => (
          <tr key={room._id}>
            <td>{room.name}</td>
            <td>{room.floor ? room.floor.name : 'Không có'}</td>
            <td>{room.hotel ? room.hotel.name : 'Không có'}</td>
            <td>{formatPrice(room.price)}</td>
            <td>
              <span className={`${styles.status} ${getStatusClass(room.isAvailable)}`}>
                {room.isAvailable ? 'Còn trống' : 'Đã đặt'}
              </span>
            </td>
            <td className={styles.actions}>
              <Button 
                variant="primary" 
                onClick={() => handleEdit(room)}
                className={styles.editButton}
              >
                Chỉnh sửa
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteClick(room._id)}
                className={styles.deleteButton}
              >
                Xoá
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {showConfirmDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Xác nhận xoá</h3>
            <p>Bạn có chắc chắn muốn xoá phòng này không?</p>
            <div className={styles.modalActions}>
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirmDelete(false)}
              >
                Huỷ
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
              >
                Xoá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
