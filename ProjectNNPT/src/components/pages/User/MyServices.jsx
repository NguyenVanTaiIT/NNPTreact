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

  const handleCancelService = async (invoiceId) => {
    try {
      const response = await cancelService(invoiceId);
      if (response.success) {
        toast.success('Hủy dịch vụ thành công');
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
            {services.map((invoice) => (
              <div key={invoice._id} className={styles.invoiceCard}>
                <h3>Hóa đơn #{invoice._id.slice(-6).toUpperCase()}</h3>
                <div className={styles.invoiceMeta}>
                  <span>Ngày tạo: {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>Tổng tiền: {invoice.grandTotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                {invoice.items.map((item, idx) => (
                  <div key={idx} className={styles.serviceCard}>
                    <div className={styles.serviceHeader}>
                      <h4>{item.serviceId?.name || 'Dịch vụ không xác định'}</h4>
                      <span className={`${styles.status} ${styles[invoice.status]}`}>
                        {invoice.status === 'active' ? 'Đang hoạt động' :
                         invoice.status === 'paid' ? 'Đã thanh toán' :
                         invoice.status === 'unpaid' ? 'Chưa thanh toán' :
                         'Đã hủy'}
                      </span>
                    </div>

                    <div className={styles.serviceDetails}>
                      <div className={styles.detailItem}>
                        <span>Mô tả:</span>
                        <span>{item.serviceId?.description || 'Không có mô tả'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Số lượng:</span>
                        <span>{item.quantity}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Đơn giá:</span>
                        <span>{item.unitPrice.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span>Thành tiền:</span>
                        <span>{item.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>

                    <div className={styles.serviceActions}>
                      <Link
                        to={`/service/${item.serviceId?._id || ''}`}
                        className={styles.btnView}
                      >
                        Xem chi tiết
                      </Link>
                      {invoice.status === 'active' && (
                        <button
                          className={styles.btnCancel}
                          onClick={() => handleCancelService(invoice._id)}
                        >
                          Hủy dịch vụ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
