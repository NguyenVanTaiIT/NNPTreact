import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../../../services/bookingService';
import { getInvoiceByBookingId } from '../../../services/invoiceService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminBookings.css';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      if (response.success) {
        setBookings(response.data);
        // Fetch invoices for each booking
        const invoicePromises = response.data.map(booking => 
          getInvoiceByBookingId(booking._id)
            .then(invoiceResponse => {
              if (invoiceResponse.success) {
                setInvoices(prev => ({
                  ...prev,
                  [booking._id]: invoiceResponse.data
                }));
              }
            })
            .catch(err => {
              console.error(`Error fetching invoice for booking ${booking._id}:`, err);
            })
        );
        await Promise.all(invoicePromises);
      }
    } catch (err) {
      setError('Error fetching bookings');
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
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

  const handleViewInvoice = async (bookingId) => {
    try {
      const invoiceResponse = await getInvoiceByBookingId(bookingId);
      if (invoiceResponse.success) {
        // Chuyển hướng đến trang chi tiết hóa đơn
        navigate(`/admin/invoices/${invoiceResponse.data._id}`);
      } else {
        toast.error('Không thể tải hóa đơn');
      }
    } catch (err) {
      console.error('Error viewing invoice:', err);
      toast.error('Không thể tải hóa đơn');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-bookings">
      <h2>Quản lý đặt phòng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đặt phòng</th>
            <th>Thông tin người đặt</th>
            <th>Phòng</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Chi tiết thanh toán</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const invoice = invoices[booking._id];
            const serviceTotal = calculateServiceTotal(invoice);
            const roomPrice = getRoomPrice(invoice);
            const totalAmount = roomPrice + serviceTotal;
            const uniqueServices = getUniqueServices(invoice);

            return (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>
                  <div><strong>Người đặt:</strong> {booking.userId?.username || 'N/A'}</div>
                  <div><strong>Email:</strong> {booking.userId?.email || 'N/A'}</div>
                </td>
                <td>{booking.roomId?.name || 'N/A'}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div><strong>Giá phòng:</strong> {roomPrice.toLocaleString('vi-VN')} VNĐ</div>
                  {uniqueServices.length > 0 && (
                    <div>
                      <strong>Dịch vụ đã chọn:</strong>
                      {uniqueServices.map((service, index) => (
                        <div key={index} style={{ marginLeft: '10px' }}>
                          - {service.description}: {service.quantity} x {service.unitPrice.toLocaleString('vi-VN')} VNĐ
                        </div>
                      ))}
                      <div><strong>Tổng tiền dịch vụ:</strong> {serviceTotal.toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                  )}
                  <div className="total-amount">
                    <strong>Tổng cộng:</strong> {totalAmount.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <button 
                    onClick={() => handleViewInvoice(booking._id)}
                    className="btn-view-invoice"
                  >
                    Xem hóa đơn
                  </button>
                </td>
                <td>
                  <span className={`status ${booking.status}`}>
                    {booking.status === 'pending' ? 'Chờ xác nhận' :
                     booking.status === 'confirmed' ? 'Đã xác nhận' :
                     booking.status === 'cancelled' ? 'Đã hủy' : booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleConfirmBooking(booking._id)}
                      className="btn-confirm"
                    >
                      Xác nhận
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="btn-cancel"
                    >
                      Hủy đặt phòng
                    </button>
                  )}
                  {booking.status === 'cancelled' && (
                    <button 
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings; 