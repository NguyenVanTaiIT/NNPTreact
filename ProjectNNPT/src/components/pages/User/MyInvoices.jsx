import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../components/CSS/UserCSS/MyInvoices.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getUserInvoices } from '../../../services/invoiceService';
import { toast } from 'react-toastify';

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserInvoices();
      if (response.success) {
        setInvoices(response.data);
        console.log('Invoices:', response.data);
      } else {
        setError(response.message || 'Không thể lấy danh sách hóa đơn');
        toast.error(response.message || 'Không thể lấy danh sách hóa đơn');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error.message || 'Không thể lấy danh sách hóa đơn');
      toast.error(error.message || 'Không thể lấy danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải danh sách hóa đơn...</p>
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
        <h2>Hóa Đơn Của Tôi</h2>
        
        {invoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa có hóa đơn nào.</p>
            <Link to="/rooms-tariff" className={styles.btnPrimary}>
              Đặt Phòng Ngay
            </Link>
          </div>
        ) : (
          <div className={styles.invoicesList}>
            {invoices.map((invoice) => (
              <div key={invoice._id} className={styles.invoiceCard}>
                <div className={styles.invoiceHeader}>
                  <h3>Hóa đơn #{invoice._id.slice(-6)}</h3>
                  <span className={`${styles.status} ${styles[invoice.status]}`}>
                    {invoice.status === 'pending' ? 'Chờ thanh toán' :
                     invoice.status === 'paid' ? 'Đã thanh toán' :
                     invoice.status === 'unpaid' ? 'Chờ thanh toán' :
                     'Đã hủy'}
                  </span>
                </div>
                
                <div className={styles.invoiceDetails}>
                  <div className={styles.detailItem}>
                    <span>Phòng:</span>
                    <span>{invoice.bookingId?.roomId?.description || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Ngày tạo:</span>
                    <span>{new Date(invoice.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Tổng tiền:</span>
                    <span>{invoice.totalAmount?.toLocaleString('vi-VN') || '0'} VNĐ</span>
                  </div>
                </div>

                <div className={styles.invoiceActions}>
                  <Link 
                    to={`/invoices/${invoice._id}`}
                    className={styles.btnView}
                  >
                    Xem chi tiết
                  </Link>
                  {invoice.status === 'pending' && (
                    <Link 
                      to={`/payment/${invoice._id}`}
                      className={styles.btnPay}
                    >
                      Thanh toán
                    </Link>
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

export default MyInvoices; 