import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, InputNumber, Space, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createServiceBill, getServiceBillById, updateServiceBill } from '../../../../services/serviceBillService';
import { getAllBookings } from '../../../../services/bookingService';
import { getAllServices } from '../../../../services/serviceService';
import styles from '../../../CSS/AdminCSS/ServicesBill.module.css';

const { Option } = Select;

const ServicesBillForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    fetchBookingsAndServices();
    if (id) {
      fetchBillDetails();
    }
  }, [id]);

  const fetchBookingsAndServices = async () => {
    try {
      const [bookingsResponse, servicesResponse] = await Promise.all([
        getAllBookings(),
        getAllServices()
      ]);

      if (bookingsResponse.success) {
        setBookings(bookingsResponse.data);
      }
      if (servicesResponse.success) {
        setServices(servicesResponse.data);
      }
    } catch (error) {
      message.error('Không thể lấy dữ liệu');
    }
  };

  const fetchBillDetails = async () => {
    try {
      const response = await getServiceBillById(id);
      if (response.success) {
        const { bookingId, services: billServices } = response.data;
        form.setFieldsValue({
          bookingId: bookingId._id,
          services: billServices.map(service => ({
            serviceId: service.serviceId._id,
            quantity: service.quantity,
            price: service.price
          }))
        });
        setSelectedServices(billServices);
      }
    } catch (error) {
      message.error('Không thể lấy thông tin hóa đơn');
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const billData = {
        ...values,
        services: values.services.map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          price: service.price
        }))
      };

      const response = id
        ? await updateServiceBill(id, billData)
        : await createServiceBill(billData);

      if (response.success) {
        message.success(id ? 'Cập nhật thành công' : 'Tạo hóa đơn thành công');
        navigate('/admin/servicesbills');
      } else {
        message.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (value, index) => {
    const service = services.find(s => s._id === value);
    if (service) {
      const newServices = [...selectedServices];
      newServices[index] = service;
      setSelectedServices(newServices);
      
      // Update price in form
      const servicesField = form.getFieldValue('services');
      servicesField[index].price = service.price;
      form.setFieldsValue({ services: servicesField });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{id ? 'Chỉnh sửa hóa đơn dịch vụ' : 'Tạo hóa đơn dịch vụ mới'}</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
      >
        <Form.Item
          name="bookingId"
          label="Booking"
          rules={[{ required: true, message: 'Vui lòng chọn booking' }]}
        >
          <Select placeholder="Chọn booking">
            {bookings.map(booking => (
              <Option key={booking._id} value={booking._id}>
                {`Booking #${booking._id.slice(-6)} - ${booking.userId?.fullName || 'N/A'}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'serviceId']}
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
                  >
                    <Select
                      placeholder="Chọn dịch vụ"
                      style={{ width: 200 }}
                      onChange={(value) => handleServiceChange(value, index)}
                    >
                      {services.map(service => (
                        <Option key={service._id} value={service._id}>
                          {service.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                  >
                    <InputNumber
                      placeholder="Số lượng"
                      min={1}
                      style={{ width: 100 }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    rules={[{ required: true, message: 'Nhập đơn giá' }]}
                  >
                    <InputNumber
                      placeholder="Đơn giá"
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: 150 }}
                    />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm dịch vụ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Cập nhật' : 'Tạo hóa đơn'}
            </Button>
            <Button onClick={() => navigate('/admin/servicesbills')}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServicesBillForm; 