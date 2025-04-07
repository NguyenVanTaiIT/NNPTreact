import api from './api';

/**
 * Lấy danh sách tất cả các vai trò
 * @returns {Promise<Array>} - Danh sách vai trò
 */
export const getAllRoles = async () => {
    try {
        const response = await api.get('/roles');
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy danh sách vai trò' };
    }
};

/**
 * Lấy thông tin chi tiết của một vai trò
 * @param {string} roleId - ID của vai trò
 * @returns {Promise<Object>} - Thông tin chi tiết vai trò
 */
export const getRoleById = async (roleId) => {
    try {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy thông tin vai trò' };
    }
};

/**
 * Tạo vai trò mới
 * @param {Object} roleData - Dữ liệu vai trò mới
 * @returns {Promise<Object>} - Vai trò đã tạo
 */
export const createRole = async (roleData) => {
    try {
        const response = await api.post('/roles', roleData);
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể tạo vai trò mới' };
    }
};

/**
 * Cập nhật thông tin vai trò
 * @param {string} roleId - ID của vai trò
 * @param {Object} roleData - Dữ liệu cập nhật
 * @returns {Promise<Object>} - Vai trò đã cập nhật
 */
export const updateRole = async (roleId, roleData) => {
    try {
        const response = await api.put(`/roles/${roleId}`, roleData);
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể cập nhật vai trò' };
    }
};

/**
 * Xóa vai trò
 * @param {string} roleId - ID của vai trò
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteRole = async (roleId) => {
    try {
        const response = await api.delete(`/roles/${roleId}`);
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể xóa vai trò' };
    }
};

/**
 * Gán vai trò cho người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} roleId - ID của vai trò
 * @returns {Promise<Object>} - Kết quả gán vai trò
 */
export const assignRoleToUser = async (userId, roleId) => {
    try {
        const response = await api.post('/roles/assign', { userId, roleId });
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể gán vai trò cho người dùng' };
    }
};

/**
 * Xóa vai trò khỏi người dùng
 * @param {string} userId - ID của người dùng
 * @param {string} roleId - ID của vai trò
 * @returns {Promise<Object>} - Kết quả xóa vai trò
 */
export const removeRoleFromUser = async (userId, roleId) => {
    try {
        const response = await api.delete('/roles/remove', { data: { userId, roleId } });
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể xóa vai trò khỏi người dùng' };
    }
};

/**
 * Lấy danh sách vai trò của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array>} - Danh sách vai trò của người dùng
 */
export const getUserRoles = async (userId) => {
    try {
        const response = await api.get(`/roles/user/${userId}`);
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        throw error.response?.data || { message: 'Không thể lấy danh sách vai trò của người dùng' };
    }
};

/**
 * Kiểm tra xem người dùng có vai trò cụ thể không
 * @param {string} userId - ID của người dùng
 * @param {string} roleName - Tên vai trò cần kiểm tra
 * @returns {Promise<boolean>} - true nếu người dùng có vai trò, false nếu không
 */
export const checkUserRole = async (userId, roleName) => {
    try {
        const response = await api.get(`/roles/check/${userId}/${roleName}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Không thể kiểm tra vai trò của người dùng' };
    }
}; 