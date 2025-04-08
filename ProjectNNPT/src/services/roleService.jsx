import api from './api';

/**
 * Lấy danh sách tất cả các vai trò
 * @returns {Promise<Array>} - Danh sách vai trò
 */
export const getAllRoles = async () => {
    try {
        console.log('Fetching all roles...');
        const response = await api.get('/roles');
        console.log('Roles API response:', response.data);
        
        // Handle both response formats
        if (Array.isArray(response.data)) {
            // Direct array response
            console.log('Roles API returned direct array:', response.data);
            return response.data;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
            // Response with success and data properties
            console.log('Roles API returned success/data format:', response.data.data);
            return response.data.data;
        }
        
        console.warn('No roles data found or invalid format:', response.data);
        return [];
    } catch (error) {
        console.error('Error fetching roles:', error);
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
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        console.log('Fetching role by ID:', roleId);
        const response = await api.get(`/roles/${roleId}`);
        console.log('Role details response:', response.data);
        
        // Handle both response formats
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        } else if (response.data && response.data.roleName) {
            // Direct role object response
            return response.data;
        }
        
        console.warn('Invalid role response format:', response.data);
        return null;
    } catch (error) {
        console.error('Error fetching role by ID:', error);
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
        if (!roleData || typeof roleData !== 'object') {
            throw new Error('Invalid role data');
        }
        console.log('Creating new role with data:', roleData);
        const response = await api.post('/roles', roleData);
        console.log('Create role response:', response.data);
        
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        console.warn('Invalid response format for role creation:', response.data);
        return null;
    } catch (error) {
        console.error('Error creating role:', error);
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
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!roleData || typeof roleData !== 'object') {
            throw new Error('Invalid role data');
        }
        console.log('Updating role:', roleId, 'with data:', roleData);
        const response = await api.put(`/roles/${roleId}`, roleData);
        console.log('Update role response:', response.data);
        
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        console.warn('Invalid response format for role update:', response.data);
        return null;
    } catch (error) {
        console.error('Error updating role:', error);
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
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        console.log('Deleting role:', roleId);
        const response = await api.delete(`/roles/${roleId}`);
        console.log('Delete role response:', response.data);
        
        if (response.data && response.data.success) {
            return response.data;
        }
        console.warn('Invalid response format for role deletion:', response.data);
        return null;
    } catch (error) {
        console.error('Error deleting role:', error);
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
        if (!userId || !roleId) {
            throw new Error('User ID and Role ID are required');
        }
        console.log('Assigning role:', roleId, 'to user:', userId);
        const response = await api.post('/roles/assign', { userId, roleId });
        console.log('Assign role response:', response.data);
        
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        console.warn('Invalid response format for role assignment:', response.data);
        return null;
    } catch (error) {
        console.error('Error assigning role to user:', error);
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