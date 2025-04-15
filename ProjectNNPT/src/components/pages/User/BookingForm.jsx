import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../components/CSS/UserCSS/BookingForm.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import { getRoomById } from '../../../services/roomService.jsx';
import { createBooking } from '../../../services/bookingService.jsx';
import { createInvoice, getInvoiceByBookingId } from '../../../services/invoiceService.jsx';
import { getUserBookings, getAllBookings, getBookingById } from '../../../services/bookingService.jsx';
import { getAllServices } from '../../../services/serviceService.jsx';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { toast } from 'react-toastify';

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoice, setInvoice] = useState(null);
  const location = useLocation();

  // Fetch all available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        if (response && response.success) {
          // Filter out the booking service and group services by name
          const servicesMap = new Map();
          
          response.data
            .filter(service => service._id !== '67f40fa8d015835f87d8521e')
            .forEach(service => {
              const serviceName = service.name.toLowerCase().trim();
              if (!servicesMap.has(serviceName)) {
                servicesMap.set(serviceName, {
                  _id: service._id,
                  name: service.name,
                  price: service.price,
                  description: service.description,
                  status: service.status
                });
              }
            });
          
          setServices(Array.from(servicesMap.values()));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  // Calculate total price when room or selected services change
  useEffect(() => {
    if (room) {
      let total = room.price; // Base price is room price
      
      // Add price of selected services
      selectedServices.forEach(service => {
        total += service.totalPrice;
      });
      
      setTotalPrice(total);
      console.log('Updated total price:', total);
    }
  }, [room, selectedServices]);

  // Fetch invoice data when viewing an existing booking
  useEffect(() => {
    const fetchInvoice = async () => {
      if (isBooked && bookingData) {
        try {
          const invoiceResponse = await getInvoiceByBookingId(bookingData._id);
          if (invoiceResponse.success) {
            setInvoice(invoiceResponse.data);
            console.log('Invoice data:', invoiceResponse.data);
          }
        } catch (err) {
          console.error('Error fetching invoice:', err);
        }
      }
    };

    fetchInvoice();
  }, [isBooked, bookingData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setError('Vui lòng đăng nhập để đặt phòng');
          toast.error('Vui lòng đăng nhập để đặt phòng');
          setLoading(false);
          return;
        }

        // Kiểm tra xem đây là tạo booking mới hay xem booking cũ
        const isViewingExisting = location.state?.isViewingBooking || false;
        
        if (!isViewingExisting) {
          const roomResponse = await getRoomById(id);
          
          if (!roomResponse) {
            setError('Không tìm thấy thông tin phòng');
            toast.error('Không tìm thấy thông tin phòng');
            return;
          }
          if (!roomResponse.isAvailable) {
            setError('Phòng này hiện không khả dụng');
            toast.error('Phòng này hiện không khả dụng');
            return;
          }

          setRoom(roomResponse);
          setIsAuthorized(true);
        } else {
          // Đây là trường hợp xem booking cũ, id là bookingId
          console.log('Viewing existing booking:', id);
          const bookingResponse = await getBookingById(id);
          
          if (!bookingResponse.success) {
            setError('Không tìm thấy thông tin đặt phòng');
            toast.error('Không tìm thấy thông tin đặt phòng');
            return;
          }

          const booking = bookingResponse.data;
          
          // Kiểm tra quyền xem booking
          const bookingUserId = booking.userId && typeof booking.userId === 'object' 
            ? booking.userId._id 
            : booking.userId;
          
          console.log('Booking user ID:', bookingUserId);
          console.log('Current user ID:', user._id);
          console.log('Is authorized:', String(bookingUserId) === String(user._id));
          
          if (String(bookingUserId) === String(user._id)) {
            setIsAuthorized(true);
            setIsBooked(true);
            setBookingData(booking);
            
            // Lấy thông tin phòng mới nhất
            const roomId = booking.roomId && typeof booking.roomId === 'object' 
              ? booking.roomId._id 
              : booking.roomId;
            
            console.log('Fetching latest room data for ID:', roomId);
            const roomResponse = await getRoomById(roomId);
            console.log('Latest room data:', roomResponse);
            
            if (roomResponse) {
              setRoom(roomResponse);
            } else {
              setRoom(booking.roomId);
            }
          } else {
            setError('Bạn không có quyền xem thông tin đặt phòng này');
            toast.error('Bạn không có quyền xem thông tin đặt phòng này');
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message || 'Không thể tải thông tin. Vui lòng thử lại sau.');
        toast.error(err.message || 'Không thể tải thông tin. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, location]);

  useEffect(() => {
    
    // Nếu đã có bookingData nhưng room vẫn là null, thử lấy lại dữ liệu phòng
    if (bookingData && !room) {
      console.log('Có bookingData nhưng không có room, thử lấy lại dữ liệu phòng');
      const roomId = bookingData.roomId && typeof bookingData.roomId === 'object' 
        ? bookingData.roomId._id 
        : bookingData.roomId;
      
      console.log('Room ID from bookingData:', roomId);
      
      // Fetch room data
      getRoomById(roomId).then(roomResponse => {
        console.log('Room response in useEffect:', roomResponse);
        if (roomResponse) {
          console.log('Setting room in useEffect:', roomResponse);
          setRoom(roomResponse);
        }
      }).catch(err => {
        console.error('Error fetching room in useEffect:', err);
      });
    }
  }, [room, isBooked, bookingData, isAuthorized]);

  // Handle service selection
  const handleServiceChange = (service, isSelected) => {
    if (isSelected) {
      // Kiểm tra xem dịch vụ đã tồn tại chưa dựa trên tên dịch vụ
      const existingService = selectedServices.find(s => 
        s.name.toLowerCase().trim() === service.name.toLowerCase().trim()
      );

      if (existingService) {
        // Nếu dịch vụ đã tồn tại, tăng số lượng và cập nhật giá
        setSelectedServices(selectedServices.map(s =>
          s.name.toLowerCase().trim() === service.name.toLowerCase().trim()
            ? {
                ...s,
                quantity: (s.quantity || 1) + 1,
                totalPrice: (s.quantity + 1) * s.price
              }
            : s
        ));
      } else {
        // Nếu là dịch vụ mới, thêm vào với số lượng 1
        setSelectedServices([...selectedServices, {
          ...service,
          quantity: 1,
          totalPrice: service.price
        }]);
      }
    } else {
      // Xóa dịch vụ khỏi danh sách đã chọn
      setSelectedServices(selectedServices.filter(s => 
        s.name.toLowerCase().trim() !== service.name.toLowerCase().trim()
      ));
    }
  };

  // Handle service quantity change
  const handleQuantityChange = (serviceId, quantity) => {
    const newQuantity = parseInt(quantity) || 0;
    setSelectedServices(selectedServices.map(service => {
      if (service._id === serviceId) {
        return {
          ...service,
          quantity: newQuantity,
          totalPrice: service.price * newQuantity
        };
      }
      return service;
    }));
  };

  // Lọc các dịch vụ trùng lặp dựa trên serviceId
  const getUniqueServices = (invoice) => {
    if (!invoice || !invoice.items) return [];
    
    const uniqueServices = {};
    
    invoice.items
      .filter(item => item.serviceId !== "67f40fa8d015835f87d8521e") // Exclude booking service
      .forEach(item => {
        const serviceKey = item.description.toLowerCase().trim(); // Use service name as key
        if (!uniqueServices[serviceKey]) {
          uniqueServices[serviceKey] = {
            ...item,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: (item.unitPrice || 0) * (item.quantity || 1)
          };
        } else {
          // If service already exists, update quantity and total price
          uniqueServices[serviceKey].quantity += (item.quantity || 1);
          uniqueServices[serviceKey].totalPrice = 
            uniqueServices[serviceKey].unitPrice * uniqueServices[serviceKey].quantity;
        }
      });
    
    return Object.values(uniqueServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vui lòng đăng nhập để đặt phòng');
      toast.error('Vui lòng đăng nhập để đặt phòng');
      return;
    }

    try {
      if (!room || !user) {
        throw new Error('Room or user information is missing.');
      }

      const bookingRequest = {
        roomId: room._id,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        totalPrice: totalPrice
      };

      console.log('Booking Request:', bookingRequest); // Log the request

      const bookingResponse = await createBooking(bookingRequest);
      console.log('Booking Response:', bookingResponse); // Log the response
      
      if (!bookingResponse || !bookingResponse.success) {
        throw new Error(bookingResponse?.message || 'Không thể tạo đặt phòng. Vui lòng thử lại.');
      }
      
      const booking = bookingResponse.data;

      // Group services by name before creating invoice items
      const groupedServices = selectedServices.reduce((acc, service) => {
        const key = service.name.toLowerCase().trim();
        if (!acc[key]) {
          acc[key] = {
            ...service,
            quantity: service.quantity,
            totalPrice: service.totalPrice
          };
        } else {
          acc[key].quantity += service.quantity;
          acc[key].totalPrice = acc[key].price * acc[key].quantity;
        }
        return acc;
      }, {});

      // Prepare invoice items with grouped services
      const invoiceItems = [
        // Booking service
        {
          serviceId: "67f49182a3adee2b7c6dd4ab",
          description: `Đặt phòng ${room.name}`,
          quantity: 1,
          unitPrice: room.price,
          totalPrice: room.price
        },
        // Add grouped services
        ...Object.values(groupedServices).map(service => ({
          serviceId: service._id,
          description: service.name,
          quantity: service.quantity,
          unitPrice: service.price,
          totalPrice: service.totalPrice
        }))
      ];

      // Create invoice
      const invoiceData = {
        bookingId: booking._id,
        userId: user.id,
        items: invoiceItems,
        totalAmount: totalPrice,
        grandTotal: totalPrice
      };

      console.log('Sending invoice data:', invoiceData);
      const invoiceResponse = await createInvoice(invoiceData);
      
      if (!invoiceResponse || !invoiceResponse.success) {
        throw new Error(invoiceResponse?.message || 'Không thể tạo hóa đơn. Vui lòng thử lại.');
      }

      setIsBooked(true);
      setBookingData(booking);
      
      toast.success('Đặt phòng thành công!');
      
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
      toast.error(err.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
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
            <p className={styles.errorDetail}>
              Booking ID: {id}<br />
              Các booking ID có sẵn: 67f423d6735c3e070e2d50fe, 67f43dcf55798e0b923cd764
            </p>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/my-bookings')}
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
          >
            Quay lại trang danh sách đặt phòng
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Xác Nhận Đặt Phòng</h2>
        {room && (
          <div className={styles.bookingForm}>
            {isBooked ? (
              <div className={styles.bookedMessage}>
                {bookingData && (
                  <>
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
                      <p>Trạng thái: {
                        bookingData.status === 'pending' ? 'Đang chờ xác nhận' : 
                        bookingData.status === 'cancelled' ? 'Đã hủy' : 
                        'Đã xác nhận'
                      }</p>
                      <p>Ngày check-in: {new Date(bookingData.checkInDate).toLocaleDateString('vi-VN')}</p>
                      <p>Ngày check-out: {new Date(bookingData.checkOutDate).toLocaleDateString('vi-VN')}</p>
                      <p>Tổng tiền: {bookingData.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                      
                      {/* Hiển thị dịch vụ bổ sung nếu có */}
                      {invoice && invoice.items && invoice.items.length > 0 && (
                        <div className={styles.servicesSection}>
                          <h4>Dịch vụ bổ sung</h4>
                          {getUniqueServices(invoice).map((service, index) => (
                            <div key={index} className={styles.serviceItem}>
                              <span>{service.description}</span>
                              <span>{service.quantity} x {service.unitPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                <button 
                  className={styles.viewBookingsButton}
                  onClick={() => navigate('/my-bookings')}
                >
                  Xem danh sách đặt phòng
                </button>
              </div>
            ) : (
              <>
                <div className={styles.roomInfo}>
                  <h3>{room.name}</h3>
                  <p>Loại phòng: {room.type}</p>
                  <p>Giá: {room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
                </div>
                
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

                {/* Dịch vụ bổ sung */}
                <div className={styles.servicesSection}>
                  <h3>Dịch vụ bổ sung</h3>
                  <div className={styles.servicesList}>
                    {services.length > 0 ? (
                      services.map(service => (
                        <div key={service._id} className={styles.serviceItem}>
                          <div className={styles.serviceInfo}>
                            <input
                              type="checkbox"
                              id={`service-${service._id}`}
                              onChange={(e) => handleServiceChange(service, e.target.checked)}
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
                                onChange={(e) => handleQuantityChange(service._id, e.target.value)}
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

                {/* Tổng tiền */}
                <div className={styles.totalPrice}>
                  <h4>Tổng tiền:</h4>
                  <p>{totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isBooked}
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
    </>
  );
}

export default BookingForm; 