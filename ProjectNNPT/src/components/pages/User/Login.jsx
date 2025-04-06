import React, { useState } from "react";
import styles from "../../CSS/UserCSS/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { getRoleById } from '../../../services/roleService';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ username, password });
      // Kiểm tra vai trò người dùng và điều hướng phù hợp
      const user = response.user;
      
      // Kiểm tra vai trò admin
      let isAdmin = false;
      
      if (user.role) {
        if (user.role === 'Admin' || user.role === 'admin') {
          isAdmin = true;
        } else if (typeof user.role === 'object' && user.role.roleName === 'Admin') {
          isAdmin = true;
        } else if (typeof user.role === 'string') {
          // Nếu role là ID, lấy thông tin role
          try {
            const roleDetails = await getRoleById(user.role);
            isAdmin = roleDetails.roleName === 'Admin';
          } catch (err) {
            console.error('Error fetching role details:', err);
            isAdmin = false;
          }
        }
      }
      
      if (isAdmin) {
        navigate('/admin'); // Điều hướng admin đến trang admin
      } else {
        navigate('/'); // Điều hướng người dùng thường về trang chủ
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Sign in Your Account</h1>

        <form className={styles.loginInput} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.loginError}>{error}</p>}

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <p className={styles.loginText}>
          Don't have an account yet? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;