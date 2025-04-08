import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllServiceBills, deleteServiceBill } from '../../../../services/serviceBillService';
import styles from '../../../CSS/AdminCSS/ServicesBill.module.css';

const ServicesBillList = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await getAllServiceBills();
      if (response.success) {
        setBills(response.data);
      } else {
        message.error('Không thể lấy danh sách hóa đơn dịch vụ');
      }
    } catch (error) {
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteServiceBill(id);
      if (response.success) {
        message.success('Xóa hóa đơn thành công');
        fetchBills();
      } else {
        message.error('Không thể xóa hóa đơn');
      }
    } catch (error) {
      message.error(error.message || 'Đã có lỗi xảy ra');
    }
  };

  const showBillDetails = (bill) => {
    setSelectedBill(bill);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-6).toUpperCase(),
    },
    {
      title: 'Khách hàng',
      dataIndex: ['userId', 'fullName'],
      key: 'userName',
      render: (text, record) => record.userId?.fullName || 'N/A',
    },
    {
      title: 'Booking ID',
      dataIndex: ['bookingId', '_id'],
      key: 'bookingId',
      render: (id) => id ? id.slice(-6).toUpperCase() : 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showBillDetails(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/servicesbills/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => handleDelete(record._id),
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý hóa đơn dịch vụ</h1>
        <Button
          type="primary"
          onClick={() => navigate('/admin/servicesbills/create')}
        >
          Tạo hóa đơn mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={bills}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng số ${total} hóa đơn`,
        }}
      />

      <Modal
        title="Chi tiết hóa đơn dịch vụ"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBill && (
          <div className={styles.billDetails}>
            <div className={styles.billInfo}>
              <p><strong>Mã hóa đơn:</strong> {selectedBill._id}</p>
              <p><strong>Khách hàng:</strong> {selectedBill.userId?.fullName || 'N/A'}</p>
              <p><strong>Booking:</strong> {selectedBill.bookingId?._id || 'N/A'}</p>
              <p><strong>Ngày tạo:</strong> {new Date(selectedBill.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            
            <div className={styles.servicesTable}>
              <h3>Danh sách dịch vụ</h3>
              <Table
                dataSource={selectedBill.services}
                columns={[
                  {
                    title: 'Tên dịch vụ',
                    dataIndex: ['serviceId', 'name'],
                    key: 'serviceName',
                    render: (text, record) => record.serviceId?.name || 'N/A',
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
                  },
                  {
                    title: 'Thành tiền',
                    key: 'total',
                    render: (_, record) => `${(record.price * record.quantity)?.toLocaleString('vi-VN')} VNĐ`,
                  },
                ]}
                pagination={false}
                rowKey={(record) => record.serviceId?._id || record._id}
              />
            </div>
            
            <div className={styles.totalAmount}>
              <h3>Tổng tiền: {selectedBill.totalAmount?.toLocaleString('vi-VN')} VNĐ</h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServicesBillList; 