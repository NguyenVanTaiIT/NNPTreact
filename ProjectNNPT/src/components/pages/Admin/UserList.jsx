import { useState } from 'react';
import styles from '../../CSS/AdminCSS/UserList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';
import UserForm from './UserForm';

const UserList = ({ users, roles = [], onDelete, onEdit, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    console.log('UserList - Editing user:', user);
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('UserList - Form submitted with data:', formData);
    if (selectedUser) {
      // Pass the form data to the parent component
      onEdit(formData);
    }
    setShowForm(false);
  };

  const getRoleName = (role) => {
    if (!role) return 'No Role';
    if (typeof role === 'string') {
      // Try to find the role name from the roles array
      const foundRole = roles.find(r => r._id === role);
      return foundRole ? foundRole.roleName : role;
    }
    return role.roleName || 'Unknown Role';
  };

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h2>User Management</h2>
      </div>

      {showForm && (
        <UserForm
          user={selectedUser}
          roles={roles}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table headers={['Username', 'Email', 'Full Name', 'Role', 'Status', 'Actions']}>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.fullName || '-'}</td>
            <td>
              <span className={`${styles.role} ${styles[getRoleName(user.role).toLowerCase()]}`}>
                {getRoleName(user.role)}
              </span>
            </td>
            <td>
              <span className={`${styles.status} ${user.status ? styles.active : styles.inactive}`}>
                {user.status ? 'Active' : 'Inactive'}
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