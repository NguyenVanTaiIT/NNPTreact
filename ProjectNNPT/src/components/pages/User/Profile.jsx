import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../components/CSS/UserCSS/Profile.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { toast } from 'react-toastify';
import { updateUser } from '../../../services/userService';

function Profile() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Profile - user object:', user);
      console.log('Profile - user ID:', user?._id || user?.id);
      
      // Gọi API để cập nhật thông tin người dùng
      const updatedUser = await updateUser(user?._id || user?.id, formData);
      // Cập nhật context với thông tin mới
      updateAuthUser(updatedUser);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <p>Vui lòng đăng nhập để xem hồ sơ của bạn.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h2>Hồ Sơ Của Tôi</h2>
          
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
              <small>Không thể thay đổi tên đăng nhập</small>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="avatarUrl">URL ảnh đại diện</label>
              <input
                type="text"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile; 