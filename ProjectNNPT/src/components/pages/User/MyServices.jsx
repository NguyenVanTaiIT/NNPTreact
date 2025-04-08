import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../components/CSS/UserCSS/MyServices.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getUserServices, cancelService } from '../../../services/serviceService';
import { toast } from 'react-toastify';

function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching user services...');
      const response = await getUserServices();
      console.log('Response from getUserServices:', response);
      
      if (response.success) {
        console.log('Setting services:', response.data);
        setServices(response.data);
      } else {
        console.error('Error in response:', response.message);
        setError(response.message || 'Không thể lấy danh sách dịch vụ');
        toast.error(response.message || 'Không thể lấy danh sách dịch vụ');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error.message || 'Không thể lấy danh sách dịch vụ');
      toast.error(error.message || 'Không thể lấy danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelService = async (serviceId) => {
    try {
      const response = await cancelService(serviceId);
      if (response.success) {
        toast.success('Hủy dịch vụ thành công');
        // Cập nhật lại danh sách dịch vụ
        fetchServices();
      } else {
        toast.error(response.message || 'Không thể hủy dịch vụ');
      }
    } catch (error) {
      console.error('Error canceling service:', error);
      toast.error(error.message || 'Không thể hủy dịch vụ');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải danh sách dịch vụ...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Dịch Vụ Đã Đăng Ký</h2>
        
        {services.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa đăng ký dịch vụ nào.</p>
            <p>Dịch vụ bổ sung từ các đặt phòng của bạn sẽ hiển thị ở đây.</p>
            <Link to="/rooms-tariff" className={styles.btnPrimary}>
              Xem Dịch Vụ
            </Link>
          </div>
        ) : (
          <div className={styles.servicesList}>
            {services.map((service) => (
              <div key={service._id} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <h3>{service.name}</h3>
                  <span className={`${styles.status} ${styles[service.status]}`}>
                    {service.status === 'active' ? 'Đang hoạt động' :
                     service.status === 'completed' ? 'Đã hoàn thành' :
                     'Đã hủy'}
                  </span>
                </div>
                
                <div className={styles.serviceDetails}>
                  <div className={styles.detailItem}>
                    <span>Mô tả:</span>
                    <span>{service.description}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Ngày đăng ký:</span>
                    <span>{new Date(service.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Giá:</span>
                    <span>{service.price?.toLocaleString('vi-VN') || '0'} VNĐ</span>
                  </div>
                </div>

                <div className={styles.serviceActions}>
                  <Link 
                    to={`/service/${service._id}`}
                    className={styles.btnView}
                  >
                    Xem chi tiết
                  </Link>
                  {service.status === 'active' && (
                    <button 
                      className={styles.btnCancel}
                      onClick={() => handleCancelService(service._id)}
                    >
                      Hủy dịch vụ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyServices; 