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
      
      // Fetch users and roles separately to better handle errors
      const usersData = await getAllUsers();
      console.log('Fetched users:', usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      const rolesData = await getAllRoles();
      console.log('Fetched roles:', rolesData);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      
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
      console.log('handleUpdate - userData:', userData);
      
      if (!userData || !userData._id) {
        throw new Error('No user ID provided for update');
      }
      
      const userId = userData._id;
      // Remove _id from the update data to avoid conflicts
      const { _id, ...updateData } = userData;
      
      console.log('Updating user with ID:', userId);
      console.log('Update data:', updateData);
      
      const updatedUser = await updateUser(userId, updateData);
      console.log('User updated successfully:', updatedUser);
      
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
      console.log('Creating user with data:', userData);
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
    console.log('Opening form with user:', user);
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div>
      <UserList
        users={users}
        roles={roles}
        onDelete={handleDelete}
        onEdit={handleUpdate}
        onCreate={handleCreate}
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