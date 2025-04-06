import React, { useState } from "react";
import styles from "../../CSS/UserCSS/Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../../../services/authService';
import LoadingSpinner from '../../utils/LoadingSpinner';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerForm}>
        <h1 className={styles.registerTitle}>Create Your Account</h1>
        <form className={styles.registerInput} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          
          {error && <p className={styles.registerError}>{error}</p>}
          
          <button 
            type="submit" 
            className={styles.registerButton}
          >
            Register
          </button>
        </form>
        <p className={styles.registerText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;