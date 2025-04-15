import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../components/CSS/UserCSS/MyBookings.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getUserBookings, cancelBooking, deleteBooking } from '../../../services/bookingService';
import { getInvoiceByBookingId } from '../../../services/invoiceService.jsx';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState({});
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      if (!user || !user._id) {
        console.error('User not authenticated or missing _id:', user);
        setError('Vui lòng đăng nhập để xem danh sách đặt phòng');
        toast.error('Vui lòng đăng nhập để xem danh sách đặt phòng');
        setLoading(false);
        return;
      }

      const response = await getUserBookings();
      
      if (response.success) {
        setBookings(response.data || []);

        // Fetch invoices for each booking
        const invoicePromises = response.data.map(async (booking) => {
          try {
            const invoiceResponse = await getInvoiceByBookingId(booking._id);
            if (invoiceResponse.success) {
              return { bookingId: booking._id, invoice: invoiceResponse.data };
            }
            return null;
          } catch (err) {
            return null;
          }
        });

        const invoiceResults = await Promise.all(invoicePromises);
        const invoiceMap = {};
        invoiceResults.forEach(result => {
          if (result) {
            invoiceMap[result.bookingId] = result.invoice;
          }
        });
        setInvoices(invoiceMap);
      } else {
        setError(response.message || 'Không thể lấy danh sách đặt phòng');
        toast.error(response.message || 'Không thể lấy danh sách đặt phòng');
      }
    } catch (error) {
      setError(error.message || 'Không thể lấy danh sách đặt phòng');
      toast.error(error.message || 'Không thể lấy danh sách đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      console.log('Canceling booking:', bookingId);
      const response = await cancelBooking(bookingId);
      console.log('Cancel booking response:', response);
      
      if (response.success) {
        toast.success(response.message || 'Đã hủy đặt phòng thành công');
        // Refresh danh sách bookings
        fetchBookings();
      } else {
        console.error('Failed to cancel booking:', response);
        toast.error(response.message || 'Không thể hủy đặt phòng');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error(error.message || 'Không thể hủy đặt phòng');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await deleteBooking(bookingId);
      if (response.success) {
        toast.success(response.message);
        fetchBookings(); // Refresh the list
      } else {
        toast.error(response.message || 'Không thể xóa đặt phòng');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error(error.message || 'Không thể xóa đặt phòng');
    }
  };

  const getUniqueServices = (invoice) => {
    if (!invoice || !invoice.items) return [];
    
    const serviceMap = new Map();
    
    // Lọc bỏ dịch vụ đặt phòng và nhóm các dịch vụ theo tên
    invoice.items
      .filter(item => {
        const serviceName = item.description ? item.description.toLowerCase() : '';
        return !serviceName.includes('đặt phòng') && !serviceName.includes('booking');
      })
      .forEach(item => {
        const serviceName = item.description.toLowerCase().trim();
        
        if (serviceMap.has(serviceName)) {
          const existingService = serviceMap.get(serviceName);
          existingService.quantity += (item.quantity || 1);
          existingService.totalPrice = existingService.unitPrice * existingService.quantity;
        } else {
          serviceMap.set(serviceName, {
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price || 0,
            totalPrice: (item.unitPrice || item.price || 0) * (item.quantity || 1)
          });
        }
      });
    
    return Array.from(serviceMap.values());
  };

  const calculateServiceTotal = (invoice) => {
    if (!invoice || !invoice.items) return 0;
    
    const uniqueServices = getUniqueServices(invoice);
    return uniqueServices.reduce((total, service) => total + service.totalPrice, 0);
  };

  const getRoomPrice = (invoice) => {
    if (!invoice || !invoice.items) return 0;
    
    const bookingService = invoice.items.find(item => {
      const serviceName = item.description ? item.description.toLowerCase() : '';
      return serviceName.includes('đặt phòng') || serviceName.includes('booking');
    });
    
    return bookingService ? bookingService.totalPrice : 0;
  };

  const renderBookingDetails = (booking) => {
    const invoice = invoices[booking._id];
    if (!invoice) return null;

    const uniqueServices = getUniqueServices(invoice);
    const serviceTotal = calculateServiceTotal(invoice);
    const roomPrice = getRoomPrice(invoice);
    const totalAmount = roomPrice + serviceTotal;
    const hasServices = invoice && invoice.items && 
      invoice.items.some(item => item.serviceId !== "67f40fa8d015835f87d8521e");

    return (
      <div className={styles.bookingDetails}>
        <h4>Chi tiết đặt phòng:</h4>
        <p>Giá phòng: {roomPrice.toLocaleString('vi-VN')} VNĐ</p>
        
        {uniqueServices.length > 0 && (
          <div className={styles.servicesList}>
            <h4>Dịch vụ đã đặt:</h4>
            {uniqueServices.map((service, index) => (
              <div key={index} className={styles.serviceItem}>
                <span>{service.description}</span>
                <span>
                  {service.quantity} x {service.unitPrice.toLocaleString('vi-VN')} VNĐ = 
                  {' '}{service.totalPrice.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            ))}
            <p>Tổng tiền dịch vụ: {serviceTotal.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        )}
        
        <p className={styles.totalAmount}>
          Tổng cộng: {totalAmount.toLocaleString('vi-VN')} VNĐ
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải danh sách đặt phòng...</p>
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
        <h2>Đơn Đặt Phòng Của Tôi</h2>
        
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa có đơn đặt phòng nào.</p>
            <Link to="/rooms-tariff" className={styles.btnPrimary}>
              Đặt Phòng Ngay
            </Link>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {bookings.map((booking) => {
              const invoice = invoices[booking._id];
              const serviceTotal = calculateServiceTotal(invoice);
              const roomPrice = getRoomPrice(invoice);
              const totalAmount = roomPrice + serviceTotal;
              const hasServices = invoice && invoice.items && 
                invoice.items.some(item => item.serviceId !== "67f40fa8d015835f87d8521e");
              
              // Lọc các dịch vụ trùng lặp
              const uniqueServices = getUniqueServices(invoice);

              return (
                <div key={booking._id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <h3>Đơn đặt phòng #{booking._id.slice(-6)}</h3>
                    <span className={`${styles.status} ${styles[booking.status]}`}>
                      {booking.status === 'pending' ? 'Chờ xác nhận' :
                       booking.status === 'confirmed' ? 'Bạn đã đặt phòng này' :
                       'Đã hủy'}
                    </span>
                  </div>
                  
                  <div className={styles.bookingDetails}>
                    <div className={styles.detailItem}>
                      <span>Phòng:</span>
                      <span>{booking.roomId?.name || 'N/A'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Ngày check-in:</span>
                      <span>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span>Ngày check-out:</span>
                      <span>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <div className={styles.priceSection}>
                      <div className={styles.detailItem}>
                        <span>Giá phòng:</span>
                        <span>{roomPrice.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      
                      {hasServices && (
                        <div className={styles.servicesSection}>
                          <h4>Dịch vụ đã chọn:</h4>
                          {uniqueServices.map((item, index) => (
                            <div key={index} className={styles.serviceItem}>
                              <span>{item.description}</span>
                              <span>{item.quantity} x {item.unitPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                          ))}
                          <div className={styles.serviceTotal}>
                            <span>Tổng tiền dịch vụ:</span>
                            <span>{serviceTotal.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                        </div>
                      )}
                      
                      <div className={styles.totalPrice}>
                        <span>Tổng tiền:</span>
                        <span>{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bookingActions}>
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className={styles.btnCancel}
                      >
                        Hủy đặt phòng
                      </button>
                    )}
                    {booking.status === 'canceled' && (
                      <button 
                        onClick={() => handleDeleteBooking(booking._id)}
                        className={styles.btnDelete}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyBookings; 