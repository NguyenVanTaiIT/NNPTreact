import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../../../components/CSS/AdminCSS/InvoiceDetail.module.css';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getInvoiceById } from '../../../services/invoiceService';
import { toast } from 'react-toastify';

function AdminInvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const separateServices = (items) => {
    if (!items) return { bookingService: null, additionalServices: [] };
    
    // Find the booking service (usually the most expensive item or the room service)
    const sortedItems = [...items].sort((a, b) => b.totalPrice - a.totalPrice);
    const bookingService = sortedItems[0];
    
    // Rest are additional services
    const additionalServices = sortedItems.slice(1);
    
    return { bookingService, additionalServices };
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInvoiceById(id);
      if (response.success) {
        console.log('Invoice data:', response.data);
        setInvoice(response.data);
      } else {
        setError(response.message || 'Không thể lấy thông tin hóa đơn');
        toast.error(response.message || 'Không thể lấy thông tin hóa đơn');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError(error.message || 'Không thể lấy thông tin hóa đơn');
      toast.error(error.message || 'Không thể lấy thông tin hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Đang tải thông tin hóa đơn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <Link to="/admin/invoices" className={styles.btnBack}>
          Quay lại danh sách hóa đơn
        </Link>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className={styles.errorContainer}>
        <p>Không tìm thấy hóa đơn</p>
        <Link to="/admin/invoices" className={styles.btnBack}>
          Quay lại danh sách hóa đơn
        </Link>
      </div>
    );
  }

  // Log để debug
  const { bookingService, additionalServices } = separateServices(invoice.items);
  console.log('Booking service:', bookingService);
  console.log('Additional services:', additionalServices);

  return (
    <div className={styles.container}>
      <div className={styles.invoiceCard}>
        <div className={styles.invoiceHeader}>
          <h2>Hóa Đơn #{invoice._id ? invoice._id.slice(-6) : 'N/A'}</h2>
          <span className={`${styles.status} ${styles[invoice.status || 'pending']}`}>
            {invoice.status === 'pending' ? 'Chờ thanh toán' :
             invoice.status === 'paid' ? 'Đã thanh toán' :
             invoice.status === 'unpaid' ? 'Chờ thanh toán' :
             'Đã hủy'}
          </span>
        </div>

        <div className={styles.invoiceInfo}>
          <div className={styles.infoItem}>
            <span>Ngày tạo:</span>
            <span>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Phòng:</span>
            <span>{invoice.bookingId?.roomId?.name || bookingService?.description || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Ngày nhận phòng:</span>
            <span>{invoice.bookingId?.checkInDate ? new Date(invoice.bookingId.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Ngày trả phòng:</span>
            <span>{invoice.bookingId?.checkOutDate ? new Date(invoice.bookingId.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Khách hàng:</span>
            <span>{invoice.userId?.fullName || invoice.userId?.username || 'N/A'}</span>
          </div>
        </div>

        <div className={styles.itemsList}>
          <h3>Chi tiết hóa đơn</h3>
          {invoice.items && (
            <>
              {/* Hiển thị dịch vụ đặt phòng */}
              {bookingService && (
                <div className={styles.itemRow}>
                  <div className={styles.itemName}>
                    {bookingService.description || 'Phí phòng'}
                  </div>
                  <div className={styles.itemQuantity}>{bookingService.quantity || 1}</div>
                  <div className={styles.itemPrice}>
                    {bookingService.unitPrice?.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className={styles.itemTotal}>
                    {bookingService.totalPrice?.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
              )}
              
              {/* Hiển thị các dịch vụ bổ sung */}
              {additionalServices.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemName}>{item.description || 'Dịch vụ bổ sung'}</div>
                  <div className={styles.itemQuantity}>{item.quantity}</div>
                  <div className={styles.itemPrice}>{item.unitPrice?.toLocaleString('vi-VN')} VNĐ</div>
                  <div className={styles.itemTotal}>{item.totalPrice?.toLocaleString('vi-VN')} VNĐ</div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.invoiceTotal}>
          <div className={styles.totalRow}>
            <span>Tổng tiền:</span>
            <span>{invoice.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>

        <div className={styles.invoiceActions}>
          <Link to="/admin/invoices" className={styles.btnBack}>
            Quay lại danh sách hóa đơn
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminInvoiceDetail; 