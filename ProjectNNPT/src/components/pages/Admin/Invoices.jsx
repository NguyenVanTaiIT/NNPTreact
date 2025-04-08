import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../CSS/AdminCSS/Invoices.module.css';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { getAllInvoices, updateInvoiceStatus } from '../../../services/invoiceService';

function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('Fetching invoices...');
      const response = await getAllInvoices();
      console.log('Invoices response in component:', response);
      
      if (response && response.success) {
        setInvoices(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } else {
        console.error('Error in response:', response);
        setError(response.message || 'Không thể tải danh sách hóa đơn');
        setInvoices([]);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus);
      // Refresh invoices list
      await fetchInvoices();
    } catch (err) {
      console.error('Error updating invoice status:', err);
      setError('Không thể cập nhật trạng thái hóa đơn. Vui lòng thử lại sau.');
    }
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/admin/invoices/${invoiceId}`);
  };

  // Ensure invoices is an array before filtering
  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(invoice => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  }) : [];

  const calculateTotalAmount = (invoice) => {
    if (!invoice.items) return 0;
    return invoice.items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải danh sách hóa đơn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản Lý Hóa Đơn</h2>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ thanh toán
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'paid' ? styles.active : ''}`}
            onClick={() => setFilter('paid')}
          >
            Đã thanh toán
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'canceled' ? styles.active : ''}`}
            onClick={() => setFilter('canceled')}
          >
            Đã hủy
          </button>
        </div>
      </div>

      <div className={styles.invoicesList}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không có hóa đơn nào.</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div key={invoice._id} className={styles.invoiceCard}>
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceInfo}>
                  <h3>Hóa đơn #{invoice._id.slice(-6)}</h3>
                  <span className={`${styles.status} ${styles[invoice.status]}`}>
                    {invoice.status === 'pending' ? 'Chờ thanh toán' :
                     invoice.status === 'paid' ? 'Đã thanh toán' :
                     invoice.status === 'unpaid' ? 'Chờ thanh toán' :
                     'Đã hủy'}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <p>Người đặt: {invoice.userId?.fullName || invoice.userId?.username || 'Không có tên'}</p>
                  <p>Email: {invoice.userId?.email || 'Không có email'}</p>
                </div>
              </div>

              <div className={styles.invoiceDetails}>
                {invoice.bookingId && (
                  <div className={styles.detailItem}>
                    <span>Đặt phòng:</span>
                    <span>
                      {new Date(invoice.bookingId.checkInDate).toLocaleDateString('vi-VN')} - 
                      {new Date(invoice.bookingId.checkOutDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span>Tổng tiền:</span>
                  <span>{calculateTotalAmount(invoice).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <div className={styles.invoiceItems}>
                <h4>Chi tiết dịch vụ</h4>
                {invoice.items && invoice.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <span>{item.description || item.serviceId?.name || 'Dịch vụ'}</span>
                    <span>{item.quantity} x {item.unitPrice?.toLocaleString('vi-VN')} VNĐ</span>
                    <span>{item.totalPrice?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                ))}
              </div>

              <div className={styles.invoiceActions}>
                {invoice.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(invoice._id, 'paid')}
                      className={styles.btnConfirm}
                    >
                      Xác nhận thanh toán
                    </button>
                    <button
                      onClick={() => handleStatusChange(invoice._id, 'canceled')}
                      className={styles.btnCancel}
                    >
                      Hủy
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleViewInvoice(invoice._id)}
                  className={styles.btnView}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Invoices; 