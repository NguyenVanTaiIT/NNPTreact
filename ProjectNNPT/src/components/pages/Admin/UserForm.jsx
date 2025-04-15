import { useState, useEffect } from 'react';
import styles from '../../CSS/AdminCSS/UserForm.module.css';
import Button from '../../common/Button';

const UserForm = ({ user, roles = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    avatarUrl: '',
    status: true,
    role: '',
  });

  useEffect(() => {
    console.log('UserForm - Danh sách vai trò:', roles);
  }, [roles]);

  useEffect(() => {
    if (user) {
      let roleId = '';

      if (user.role) {
        if (typeof user.role === 'string') {
          roleId = user.role;
        } else if (user.role._id) {
          roleId = user.role._id;
        } else if (user.role.roleName) {
          const matchingRole = roles.find(r => r.roleName === user.role.roleName);
          if (matchingRole) {
            roleId = matchingRole._id;
          }
        }
      }

      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        fullName: user.fullName || '',
        avatarUrl: user.avatarUrl || '',
        status: user.status !== undefined ? user.status : true,
        role: roleId,
      });
    }
  }, [user, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }

    if (user) {
      submitData._id = user._id;
    }

    console.log('UserForm - Gửi dữ liệu:', submitData);
    onSubmit(submitData);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>{user ? 'Mật khẩu mới ' : 'Mật khẩu'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>URL ảnh đại diện</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Chọn vai trò</option>
              {Array.isArray(roles) &&
                roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              Kích hoạt
            </label>
          </div>
          <div className={styles.formActions}>
            <Button type="button" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {user ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
