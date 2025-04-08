import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../components/CSS/UserCSS/Payment.module.css';
import Header from '../../../components/layouts/Header';
import Footer from '../../../components/layouts/Footer';
import LoadingSpinner from '../../../components/utils/LoadingSpinner';
import { getInvoiceById, updateInvoiceStatus } from '../../../services/invoiceService';
import { toast } from 'react-toastify';

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInvoiceById(id);
      if (response.success) {
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

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await updateInvoiceStatus(id, 'paid');
      if (response.success) {
        toast.success('Thanh toán thành công!');
        navigate('/my-invoices');
      } else {
        toast.error(response.message || 'Không thể xử lý thanh toán');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Không thể xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Đang tải thông tin thanh toán...</p>
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
          <button onClick={() => navigate('/my-invoices')} className={styles.btnBack}>
            Quay lại danh sách hóa đơn
          </button>
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
          <button onClick={() => navigate('/my-invoices')} className={styles.btnBack}>
            Quay lại danh sách hóa đơn
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
        <div className={styles.paymentCard}>
          <div className={styles.paymentHeader}>
            <h2>Thanh Toán Hóa Đơn #{invoice._id.slice(-6)}</h2>
          </div>

          <div className={styles.paymentInfo}>
            <div className={styles.infoItem}>
              <span>Tổng tiền:</span>
              <span className={styles.amount}>{invoice.totalAmount?.toLocaleString('vi-VN') || '0'} VNĐ</span>
            </div>
          </div>

          <div className={styles.paymentMethods}>
            <h3>Phương thức thanh toán</h3>
            <div className={styles.methodOptions}>
              <label className={styles.methodOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
              <label className={styles.methodOption}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Thẻ tín dụng</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className={styles.bankInfo}>
              <h3>Thông tin chuyển khoản</h3>
              <div className={styles.bankDetails}>
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Số tài khoản:</strong> 1234567890</p>
                <p><strong>Chủ tài khoản:</strong> NNPTHotel</p>
                <p><strong>Nội dung:</strong> HD{invoice._id.slice(-6)}</p>
              </div>
            </div>
          )}

          {paymentMethod === 'credit_card' && (
            <div className={styles.creditCardForm}>
              <h3>Thông tin thẻ</h3>
              <div className={styles.formGroup}>
                <label>Số thẻ</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ngày hết hạn</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Tên chủ thẻ</label>
                <input type="text" placeholder="NGUYEN VAN A" />
              </div>
            </div>
          )}

          <div className={styles.paymentActions}>
            <button onClick={() => navigate('/my-invoices')} className={styles.btnBack}>
              Hủy
            </button>
            <button onClick={handlePayment} className={styles.btnPay}>
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Payment; 