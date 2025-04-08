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

  // Log roles data for debugging
  useEffect(() => {
    console.log('UserForm - roles prop:', roles);
    console.log('UserForm - roles is array:', Array.isArray(roles));
    console.log('UserForm - roles length:', roles.length);
  }, [roles]);

  // Set form data when user changes
  useEffect(() => {
    if (user) {
      console.log('UserForm - user:', user);
      console.log('UserForm - user.role:', user.role);
      
      // Determine the role ID based on the user object structure
      let roleId = '';
      
      if (user.role) {
        if (typeof user.role === 'string') {
          // If role is a string (ID), use it directly
          roleId = user.role;
        } else if (user.role._id) {
          // If role is an object with _id property
          roleId = user.role._id;
        } else if (user.role.roleName) {
          // If role is an object with roleName but no _id, try to find matching role
          const matchingRole = roles.find(r => r.roleName === user.role.roleName);
          if (matchingRole) {
            roleId = matchingRole._id;
          }
        }
      }
      
      console.log('UserForm - determined roleId:', roleId);
      
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't set password for existing users
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
    
    // Create a copy of formData without empty password for updates
    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }
    
    // Include the user ID in the form data if we're editing an existing user
    if (user) {
      submitData._id = user._id;
    }
    
    console.log('UserForm - Submitting form data:', submitData);
    onSubmit(submitData);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>{user ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username</label>
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
            <label>{user ? 'New Password (leave blank to keep current)' : 'Password'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user} // Only required for new users
            />
          </div>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Avatar URL</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
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
              {Array.isArray(roles) && roles.map((role) => {
                console.log('UserForm - rendering role option:', role);
                return (
                  <option key={role._id} value={role._id}>
                    {role.roleName}
                  </option>
                );
              })}
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
              Active
            </label>
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