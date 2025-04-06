import { useState, useEffect } from 'react';
import styles from '../../CSS/AdminCSS/UserForm.module.css';
import Button from '../../common/Button';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role?._id || user.role || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{user ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formActions}>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {user ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;