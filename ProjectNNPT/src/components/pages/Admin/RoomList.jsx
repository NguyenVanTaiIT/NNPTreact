import React, { useState } from 'react';
import styles from '../../CSS/AdminCSS/RoomList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';
import RoomForm from './RoomForm';

const RoomList = ({ rooms, onDelete, onEdit, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setShowForm(true);
  };

  const handleFormSubmit = (roomData) => {
    if (selectedRoom) {
      onEdit(roomData);
    } else {
      onCreate(roomData);
    }
    setShowForm(false);
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
        <Button variant="success" onClick={handleCreate}>
          Add New Room
        </Button>
      </div>

      {showForm && (
        <RoomForm
          room={selectedRoom}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table 
        headers={[
          'Room Number', 
          'Type', 
          'Capacity', 
          'Price', 
          'Status', 
          'Actions'
        ]}
      >
        {rooms.map((room) => (
          <tr key={room._id}>
            <td>{room.roomNumber}</td>
            <td>{room.type}</td>
            <td>{room.capacity} persons</td>
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