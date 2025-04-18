import React, { useReducer, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { useBookingData } from '../../../hooks/useBookingData.jsx';
import { useServices } from '../../../hooks/useServices.jsx';
import styles from '../../../components/CSS/UserCSS/BookingForm.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { createBooking } from '../../../services/bookingService';
import { createInvoice } from '../../../services/invoiceService';

// Reducer để quản lý trạng thái
const initialState = {
  totalPrice: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOTAL_PRICE':
      return { ...state, totalPrice: action.payload };
    default:
      return state;
  }
};

// Subcomponent: Thông tin phòng
const RoomInfo = ({ room }) => (
  <div className={styles.roomInfo}>
    <h3>{room.name}</h3>
    <p>Loại phòng: {room.type}</p>
    <p>Giá: {room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
  </div>
);

// Subcomponent: Tóm tắt đặt phòng
const BookingSummary = ({ room }) => (
  <div className={styles.bookingSummary}>
    <h3>Thông tin đặt phòng</h3>
    <div className={styles.summaryItem}>
      <span>Ngày check-in:</span>
      <span>{new Date().toLocaleDateString('vi-VN')}</span>
    </div>
    <div className={styles.summaryItem}>
      <span>Ngày check-out:</span>
      <span>{new Date(Date.now() + 86400000).toLocaleDateString('vi-VN')}</span>
    </div>
    <div className={styles.summaryItem}>
      <span>Số đêm:</span>
      <span>1 đêm</span>
    </div>
    <div className={styles.summaryItem}>
      <span>Giá phòng:</span>
      <span>{room.price.toLocaleString('vi-VN')} VNĐ</span>
    </div>
  </div>
);

// Subcomponent: Dịch vụ bổ sung
const ServicesSection = ({ services, selectedServices, onServiceChange, onQuantityChange }) => (
  <div className={styles.servicesSection} role="region" aria-labelledby="services-heading">
    <h3 id="services-heading">Dịch vụ bổ sung</h3>
    <div className={styles.servicesList}>
      {services.length > 0 ? (
        services.map(service => (
          <div key={service._id} className={styles.serviceItem}>
            <div className={styles.serviceInfo}>
              <input
                type="checkbox"
                id={`service-${service._id}`}
                aria-label={`Chọn ${service.name}`}
                onChange={e => onServiceChange(service, e.target.checked)}
              />
              <label htmlFor={`service-${service._id}`}>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={styles.servicePrice}>{service.price.toLocaleString('vi-VN')} VNĐ</span>
              </label>
            </div>
            {selectedServices.some(s => s._id === service._id) && (
              <div className={styles.serviceQuantity}>
                <label htmlFor={`quantity-${service._id}`}>Số lượng:</label>
                <input
                  type="number"
                  id={`quantity-${service._id}`}
                  min="1"
                  value={selectedServices.find(s => s._id === service._id)?.quantity || 1}
                  onChange={e => onQuantityChange(service._id, parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Không có dịch vụ bổ sung nào</p>
      )}
    </div>
  </div>
);

// Subcomponent: Thông báo đặt phòng thành công
const BookedMessage = ({ bookingData, room, invoice }) => {
  const navigate = useNavigate();

  const getUniqueServices = useMemo(() => {
    if (!invoice?.items) return [];
    const uniqueServices = {};
    invoice.items
      .filter(item => item.serviceId !== '67f40fa8d015835f87d8521e')
      .forEach(item => {
        const key = item.description.toLowerCase().trim();
        uniqueServices[key] = uniqueServices[key] || {
          ...item,
          quantity: 0,
          totalPrice: 0,
        };
        uniqueServices[key].quantity += item.quantity || 1;
        uniqueServices[key].totalPrice = uniqueServices[key].unitPrice * uniqueServices[key].quantity;
      });
    return Object.values(uniqueServices);
  }, [invoice]);

  return (
    <div className={styles.bookedMessage}>
      {bookingData.status === 'pending' ? (
        <>
          <h3>Bạn đã đặt phòng này</h3>
          <p>Bạn đã đặt phòng {room.name} và đang đợi xác nhận từ admin.</p>
        </>
      ) : bookingData.status === 'cancelled' ? (
        <>
          <h3>Bạn đã hủy đặt phòng này</h3>
          <p>Bạn đã hủy đặt phòng {room.name}.</p>
        </>
      ) : (
        <>
          <h3>Bạn đã đặt phòng này</h3>
          <p>Bạn đã đặt phòng {room.name} và đã được xác nhận.</p>
        </>
      )}
      <div className={styles.bookingDetails}>
        <p>
          Trạng thái:{' '}
          {bookingData.status === 'pending'
            ? 'Đang chờ xác nhận'
            : bookingData.status === 'cancelled'
            ? 'Đã hủy'
            : 'Đã xác nhận'}
        </p>
        <p>Ngày check-in: {new Date(bookingData.checkInDate).toLocaleDateString('vi-VN')}</p>
        <p>Ngày check-out: {new Date(bookingData.checkOutDate).toLocaleDateString('vi-VN')}</p>
        <p>Tổng tiền: {bookingData.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        {getUniqueServices.length > 0 && (
          <div className={styles.servicesSection}>
            <h4>Dịch vụ bổ sung</h4>
            {getUniqueServices.map((service, index) => (
              <div key={index} className={styles.serviceItem}>
                <span>{service.description}</span>
                <span>
                  {service.quantity} x {service.unitPrice.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={styles.viewBookingsButton}
        onClick={() => navigate('/my-bookings')}
        aria-label="Xem danh sách đặt phòng"
      >
        Xem danh sách đặt phòng
      </button>
    </div>
  );
};

// Error Fallback Component
const ErrorFallback = () => (
  <div className={styles.errorContainer}>
    <h2>Đã xảy ra lỗi</h2>
    <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
  </div>
);

// Component chính
const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewingBooking = location.state?.isViewingBooking || false;
  const { room, bookingData, invoice, loading, error, isAuthorized, isBooked, user } = useBookingData(
    id,
    id,
    isViewingBooking
  );
  const { services, selectedServices, handleServiceChange, handleQuantityChange } = useServices();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Tính tổng giá
  const totalPrice = useMemo(() => {
    if (!room) return 0;
    return room.price + selectedServices.reduce((sum, service) => sum + (service.totalPrice || 0), 0);
  }, [room, selectedServices]);

  // Cập nhật totalPrice vào state
  React.useEffect(() => {
    dispatch({ type: 'SET_TOTAL_PRICE', payload: totalPrice });
  }, [totalPrice]);

  // Xử lý submit form
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt phòng');
      return;
    }

    try {
      if (!room) throw new Error('Thông tin phòng không tồn tại');

      const bookingRequest = {
        roomId: room._id,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        totalPrice,
      };

      const bookingResponse = await createBooking(bookingRequest);
      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Không thể tạo đặt phòng');
      }

      const booking = bookingResponse.data;

      const groupedServices = selectedServices.reduce((acc, service) => {
        const key = service.name.toLowerCase().trim();
        if (!acc[key]) {
          acc[key] = { ...service, quantity: service.quantity, totalPrice: service.totalPrice };
        } else {
          acc[key].quantity = (acc[key].quantity || 0) + (service.quantity || 1);
          acc[key].totalPrice = acc[key].price * acc[key].quantity;
        }
        return acc;
      }, {});

      const invoiceItems = [
        {
          serviceId: '67f49182a3adee2b7c6dd4ab',
          description: `Đặt phòng ${room.name}`,
          quantity: 1,
          unitPrice: room.price,
          totalPrice: room.price,
        },
        ...Object.values(groupedServices).map(service => ({
          serviceId: service._id,
          description: service.name,
          quantity: service.quantity,
          unitPrice: service.price,
          totalPrice: service.totalPrice,
        })),
      ];

      const invoiceData = {
        bookingId: booking._id,
        userId: user.id,
        items: invoiceItems,
        totalAmount: totalPrice,
        grandTotal: totalPrice,
      };

      const invoiceResponse = await createInvoice(invoiceData);
      if (!invoiceResponse.success) {
        throw new Error(invoiceResponse.message || 'Không thể tạo hóa đơn');
      }

      toast.success('Đặt phòng thành công!');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      const message = err.message || 'Có lỗi xảy ra khi đặt phòng';
      toast.error(message);
      Sentry.captureException(err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải thông tin phòng...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h2>Lỗi</h2>
            <p>{error}</p>
            <button
              className={styles.backButton}
              onClick={() => navigate('/my-bookings')}
              aria-label="Quay lại danh sách đặt phòng"
            >
              Quay lại danh sách đặt phòng
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <p>Bạn không có quyền xem thông tin đặt phòng này</p>
          <button
            className={styles.backButton}
            onClick={() => navigate('/my-bookings')}
            aria-label="Quay lại danh sách đặt phòng"
          >
            Quay lại trang danh sách đặt phòng
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <Header />
      <div className={styles.container}>
        <h2>Xác Nhận Đặt Phòng</h2>
        {room && (
          <div className={styles.bookingForm}>
            {isBooked && bookingData ? (
              <BookedMessage bookingData={bookingData} room={room} invoice={invoice} />
            ) : (
              <>
                <RoomInfo room={room} />
                <BookingSummary room={room} />
                <ServicesSection
                  services={services}
                  selectedServices={selectedServices}
                  onServiceChange={handleServiceChange}
                  onQuantityChange={handleQuantityChange}
                />
                <div className={styles.totalPrice}>
                  <h4>Tổng tiền:</h4>
                  <p>{state.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isBooked}
                    aria-label="Xác nhận đặt phòng"
                  >
                    {isBooked ? 'Bạn đã đặt phòng' : 'Xác nhận đặt phòng'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </Sentry.ErrorBoundary>
  );
};

export default BookingForm;