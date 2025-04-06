import { useState } from 'react';
import styles from '../../CSS/AdminCSS/UserList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';
import UserForm from './UserForm';

const UserList = ({ users, onDelete, onEdit, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleFormSubmit = (userData) => {
    if (selectedUser) {
      onEdit(userData);
    } else {
      onCreate(userData);
    }
    setShowForm(false);
  };

  const getRoleName = (role) => {
    if (!role) return 'No Role';
    if (typeof role === 'string') return role;
    return role.roleName || 'Unknown Role';
  };

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <Button variant="success" onClick={handleCreate}>
          Add New User
        </Button>
      </div>

      {showForm && (
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table headers={['ID', 'Name', 'Email', 'Role', 'Actions']}>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span className={`${styles.role} ${styles[getRoleName(user.role).toLowerCase()]}`}>
                {getRoleName(user.role)}
              </span>
            </td>
            <td>
              <Button onClick={() => handleEdit(user)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(user._id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default UserList;