import { useState } from 'react';
import styles from '../../CSS/AdminCSS/UserList.module.css';
import Button from '../../common/Button';
import Table from '../../common/Table';
import UserForm from './UserForm';

const UserList = ({ users, roles = [], onDelete, onEdit, onCreate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    console.log('UserList - Đang chỉnh sửa người dùng:', user);
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('UserList - Dữ liệu được gửi từ form:', formData);
    if (selectedUser) {
      onEdit(formData);
    }
    setShowForm(false);
  };

  const getRoleName = (role) => {
    if (!role) return 'Không có vai trò';
    if (typeof role === 'string') {
      const foundRole = roles.find(r => r._id === role);
      return foundRole ? foundRole.roleName : role;
    }
    return role.roleName || 'Không xác định';
  };

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h2>Quản lý người dùng</h2>
      </div>

      {showForm && (
        <UserForm
          user={selectedUser}
          roles={roles}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table headers={['Tên đăng nhập', 'Email', 'Họ tên', 'Vai trò', 'Trạng thái', 'Thao tác']}>
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
                {user.status ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </td>
            <td>
              <Button onClick={() => handleEdit(user)}>Chỉnh sửa</Button>
              <Button variant="danger" onClick={() => onDelete(user._id)}>
                Xóa
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default UserList;
