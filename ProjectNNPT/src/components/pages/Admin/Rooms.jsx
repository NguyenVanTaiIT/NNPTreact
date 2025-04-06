import React, { useState, useEffect } from 'react';
import RoomList from './RoomList';
import RoomForm from './RoomForm';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorMessage from '../../utils/ErrorMessage';
import { getAllRooms } from '../../../services/roomService';
import styles from '../../CSS/AdminCSS/Rooms.module.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms from database
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId);
      await fetchRooms(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to delete room. Please try again.');
      console.error('Error deleting room:', err);
    }
  };

  const handleUpdate = async (roomData) => {
    try {
      await updateRoom(selectedRoom._id, roomData);
      await fetchRooms(); // Refresh the list
      setIsFormOpen(false);
      setSelectedRoom(null);
      setError(null);
    } catch (err) {
      setError('Failed to update room. Please try again.');
      console.error('Error updating room:', err);
    }
  };

  const handleCreate = async (roomData) => {
    try {
      await createRoom(roomData);
      await fetchRooms(); // Refresh the list
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', err);
    }
  };

  const openForm = (room = null) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedRoom(null);
    setIsFormOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRooms} />;

  return (
    <div className={styles.roomsContainer}>
      <RoomList
        rooms={rooms}
        onDelete={handleDelete}
        onEdit={openForm}
        onCreate={() => openForm()}
      />
      {isFormOpen && (
        <RoomForm
          room={selectedRoom}
          onSubmit={selectedRoom ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default Rooms;