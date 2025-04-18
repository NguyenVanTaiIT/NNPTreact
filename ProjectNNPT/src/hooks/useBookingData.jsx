import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRoomById } from '../services/roomService';
import { getBookingById } from '../services/bookingService';
import { getInvoiceByBookingId } from '../services/invoiceService';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

export const useBookingData = (roomId, bookingId, isViewingBooking) => {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user) {
          throw new Error('Vui lòng đăng nhập để đặt phòng');
        }

        if (isViewingBooking) {
          const bookingResponse = await getBookingById(bookingId);
          if (!bookingResponse.success) {
            throw new Error('Không tìm thấy thông tin đặt phòng');
          }

          const booking = bookingResponse.data;
          const bookingUserId = booking.userId?._id || booking.userId;
          if (String(bookingUserId) !== String(user._id)) {
            throw new Error('Bạn không có quyền xem thông tin đặt phòng này');
          }

          const roomIdToFetch = booking.roomId?._id || booking.roomId;
          const [roomResponse, invoiceResponse] = await Promise.all([
            getRoomById(roomIdToFetch),
            getInvoiceByBookingId(booking._id),
          ]);

          setRoom(roomResponse || booking.roomId);
          setBookingData(booking);
          setInvoice(invoiceResponse.success ? invoiceResponse.data : null);
          setIsBooked(true);
          setIsAuthorized(true);
        } else {
          const roomResponse = await getRoomById(roomId);
          if (!roomResponse.isAvailable) {
            throw new Error('Phòng này hiện không khả dụng');
          }
          setRoom(roomResponse);
          setIsAuthorized(true);
        }
      } catch (err) {
        const message = err.message || 'Không thể tải thông tin';
        setError(message);
        toast.error(message);
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId, bookingId, isViewingBooking, user]);

  return { room, bookingData, invoice, loading, error, isAuthorized, isBooked, user };
};