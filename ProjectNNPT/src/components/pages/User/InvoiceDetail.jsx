import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from '../../../components/CSS/UserCSS/InvoiceDetail.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getInvoiceById } from '../../../services/invoiceService';
import { toast } from 'react-toastify';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUniqueServices = (items) => {
    const serviceMap = new Map();
    items.forEach(item => {
      const key = item.serviceId._id;
      if (serviceMap.has(key)) {
        const existing = serviceMap.get(key);
        existing.quantity += item.quantity;
        existing.totalPrice += item.totalPrice;
      } else {
        serviceMap.set(key, {
          ...item,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        });
      }
    });
    return Array.from(serviceMap.values());
  };

  const calculateServiceTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getRoomPrice = (items) => {
    const bookingService = items.find(item => item.description.toLowerCase().includes('phòng'));
    return bookingService ? bookingService.totalPrice : 0;
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching invoice with ID:', id);
      
      const response = await getInvoiceById(id);
      console.log('Invoice response:', response);
      
      if (response.success) {
        setInvoice(response.data);
      } else {
        const errorMessage = response.message || 'Không thể lấy thông tin hóa đơn';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể lấy thông tin hóa đơn';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Nếu lỗi 401 (Unauthorized), chuyển hướng đến trang đăng nhập
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
    } else {
      setError('ID hóa đơn không hợp lệ');
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải thông tin hóa đơn...</p>
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
          <Link to="/my-invoices" className={styles.btnBack}>
            Quay lại danh sách hóa đơn
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!invoice) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <p>Không tìm thấy hóa đơn</p>
          <Link to="/my-invoices" className={styles.btnBack}>
            Quay lại danh sách hóa đơn
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const uniqueServices = getUniqueServices(invoice.items);
  const serviceTotal = calculateServiceTotal(uniqueServices.filter(service => 
    !service.description.toLowerCase().includes('phòng')
  ));
  const roomPrice = getRoomPrice(invoice.items);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.invoiceCard}>
          <div className={styles.invoiceHeader}>
            <h2>Hóa Đơn #{invoice._id.slice(-6)}</h2>
            <span className={`${styles.status} ${styles[invoice.status]}`}>
              {invoice.status === 'pending' ? 'Chờ thanh toán' :
               invoice.status === 'paid' ? 'Đã thanh toán' :
               'Đã hủy'}
            </span>
          </div>

          <div className={styles.invoiceInfo}>
            <div className={styles.infoItem}>
              <span>Ngày tạo:</span>
              <span>{new Date(invoice.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
            {invoice.bookingId && (
              <>
                <div className={styles.infoItem}>
                  <span>Ngày nhận phòng:</span>
                  <span>{new Date(invoice.bookingId.checkInDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Ngày trả phòng:</span>
                  <span>{new Date(invoice.bookingId.checkOutDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={styles.infoItem}>
                  <span>Phòng:</span>
                  <span>{invoice.bookingId.roomId?.name || 'N/A'}</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.itemsList}>
            <h3>Chi tiết dịch vụ</h3>
            {invoice.items && (
              <>
                {/* Hiển thị dịch vụ đặt phòng */}
                {invoice.items.find(item => item.serviceId === "67f40fa8d015835f87d8521e") && (
                  <div className={styles.itemRow}>
                    <span className={styles.itemName}>
                      {invoice.items.find(item => item.serviceId === "67f40fa8d015835f87d8521e").description}
                    </span>
                    <span className={styles.itemQuantity}>1</span>
                    <span className={styles.itemPrice}>
                      {invoice.items.find(item => item.serviceId === "67f40fa8d015835f87d8521e").unitPrice?.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <span className={styles.itemTotal}>
                      {invoice.items.find(item => item.serviceId === "67f40fa8d015835f87d8521e").totalPrice?.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                )}
                
                {/* Hiển thị các dịch vụ bổ sung */}
                {uniqueServices.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <span className={styles.itemName}>{item.description || item.serviceId?.name || 'Dịch vụ'}</span>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                    <span className={styles.itemPrice}>{item.unitPrice?.toLocaleString('vi-VN')} VNĐ</span>
                    <span className={styles.itemTotal}>{item.totalPrice?.toLocaleString('vi-VN')} VNĐ</span>
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
            <Link to="/my-invoices" className={styles.btnBack}>
              Quay lại danh sách hóa đơn
            </Link>
            {invoice.status === 'pending' && (
              <Link to={`/payment/${invoice._id}`} className={styles.btnPay}>
                Thanh toán
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoiceDetail; 