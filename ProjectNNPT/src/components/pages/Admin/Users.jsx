import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ErrorMessage from '../../utils/ErrorMessage';
import { getAllUsers, deleteUser, updateUser, createUser } from '../../../services/userService';
import { getAllRoles } from '../../../services/roleService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load users data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      await fetchData();
      setError(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleUpdate = async (userData) => {
    try {
      await updateUser(selectedUser._id, userData);
      await fetchData();
      setIsFormOpen(false);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleCreate = async (userData) => {
    try {
      await createUser(userData);
      await fetchData();
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    }
  };

  const openForm = (user = null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <UserList
        users={users}
        onDelete={handleDelete}
        onEdit={openForm}
        onCreate={() => openForm()}
      />
      {isFormOpen && (
        <UserForm
          user={selectedUser}
          roles={roles}
          onSubmit={selectedUser ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default Users;