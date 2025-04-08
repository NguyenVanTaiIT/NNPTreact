import React, { useState, useEffect } from 'react';
import { getAllServices, createAdminService, updateService, deleteService } from '../../../services/serviceService';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '../../CSS/AdminCSS/Services.module.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    userId: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert price to number
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (editingService) {
        // Update existing service
        await updateService(editingService._id, serviceData);
        toast.success('Dịch vụ đã được cập nhật thành công!');
      } else {
        // Create new service
        await createAdminService(serviceData);
        toast.success('Dịch vụ đã được tạo thành công!');
      }
      
      setShowForm(false);
      setEditingService(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        userId: ''
      });
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error('Error creating/updating service:', err);
      toast.error(err.message || 'Không thể tạo/cập nhật dịch vụ. Vui lòng thử lại sau.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      description: service.description || '',
      userId: service.userId || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteService(serviceToDelete._id);
      toast.success('Dịch vụ đã được xóa thành công!');
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error(err.message || 'Không thể xóa dịch vụ. Vui lòng thử lại sau.');
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      userId: ''
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong className={styles.errorTitle}>Lỗi!</strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Service Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          <FaPlus className={styles.addIcon} /> Add new service
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {editingService ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Service Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="price">
                Price (VNĐ)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label} htmlFor="description">
              Service Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="3"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="userId">
                User ID (optional)
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Để trống để tạo cho admin"
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleCancelEdit}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
              >
                {editingService ? 'Cập nhật' : 'Tạo dịch vụ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Xác nhận xóa</h3>
            <p className={styles.modalText}>
            Are you sure you want to delete this service? "{serviceToDelete.name}"?
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>
                Services Name
              </th>
              <th className={styles.tableHeaderCell}>
                Price (VNĐ)
              </th>
              <th className={styles.tableHeaderCell}>
                Service Description
              </th>
              <th className={styles.tableHeaderCell}>
                Status
              </th>
              <th className={styles.tableHeaderCell}>
                Date created
              </th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.tableCellName}>{service.name}</div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellPrice}`}>
                    {service.price.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className={styles.tableCell}>
                    {service.description}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${
                      service.status === 'active' ? styles.statusActive : 
                      service.status === 'completed' ? styles.statusCompleted : 
                      styles.statusCanceled
                    }`}>
                      {service.status === 'active' ? 'Đang hoạt động' : 
                       service.status === 'completed' ? 'Đã hoàn thành' : 
                       'Đã hủy'}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(service.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableHeaderCellRight}`}>
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleEdit(service)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteClick(service)}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className={styles.tableRow}>
                <td colSpan="6" className={styles.emptyMessage}>
                  Không có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services; 