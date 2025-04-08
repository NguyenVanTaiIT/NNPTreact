import React, { useState } from 'react';
import styles from '../../CSS/AdminCSS/RoomList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';

const RoomList = ({ rooms, onDelete, onEdit, onCreate }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleEdit = (room) => {
    console.log('Edit clicked for room:', room);
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
        <h2>Room Management</h2>
        <Button variant="success" onClick={onCreate}>
          Add New Room
        </Button>
      </div>

      <Table 
        headers={[
          'Room Name', 
          'Floor',
          'Hotel',
          'Price', 
          'Status', 
          'Actions'
        ]}
      >
        {rooms.map((room) => (
          <tr key={room._id}>
            <td>{room.name}</td>
            <td>{room.floor ? room.floor.name : 'N/A'}</td>
            <td>{room.hotel ? room.hotel.name : 'N/A'}</td>
            <td>{formatPrice(room.price)}</td>
            <td>
              <span className={`${styles.status} ${getStatusClass(room.isAvailable)}`}>
                {room.isAvailable ? 'Available' : 'Occupied'}
              </span>
            </td>
            <td className={styles.actions}>
              <Button 
                variant="primary" 
                onClick={() => handleEdit(room)}
                className={styles.editButton}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteClick(room._id)}
                className={styles.deleteButton}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      {showConfirmDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this room?</p>
            <div className={styles.modalActions}>
              <Button 
                variant="secondary" 
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;