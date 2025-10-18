import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.clear();
            window.location.href = '/';
        }
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(message));
    }
);

// Staff API Service
export const staffAPI = {
    // Create operations
    createStaff: (data) => apiClient.post('/staff', data),

    createBulkStaff: (data) => apiClient.post('/staff/bulk', data),

    // Read operations
    getAllStaff: (params = {}) => {
        const { page = 0, size = 20, sortBy = 'firstName', direction = 'asc' } = params;
        return apiClient.get('/staff', { params: { page, size, sortBy, direction } });
    },

    getStaffById: (id) => apiClient.get(`/staff/${id}`),

    getStaffByStaffId: (staffId) => apiClient.get(`/staff/staff-id/${staffId}`),
    login: (credentials) => apiClient.post('/auth/login', credentials),

    getActiveStaff: () => apiClient.get('/staff/active'),

    getStaffByRole: (role) => apiClient.get(`/staff/role/${role}`),

    getStaffByStatus: (status) => apiClient.get(`/staff/status/${status}`),

    searchStaff: (params) => {
        const { searchTerm, role, status, page = 0, size = 20, sortBy = 'firstName', sortDirection = 'asc' } = params;
        return apiClient.get('/staff/search', {
            params: { searchTerm, role, status, page, size, sortBy, sortDirection }
        });
    },

    searchStaffByName: (firstName, lastName) =>
        apiClient.get('/staff/search/name', { params: { firstName, lastName } }),

    // Update operations
    updateStaff: (id, data) => apiClient.put(`/staff/${id}`, data),

    changeStaffStatus: (id, data) => apiClient.patch(`/staff/${id}/status`, data),

    updateLastLogin: (staffId) => apiClient.patch(`/staff/staff-id/${staffId}/login`),

    // Delete operations
    deactivateStaff: (id, deactivatedBy) =>
        apiClient.delete(`/staff/${id}/deactivate`, { params: { deactivatedBy } }),

    deleteStaff: (id, deletedBy) =>
        apiClient.delete(`/staff/${id}`, { params: { deletedBy } }),

    bulkDeactivateStaff: (ids, deactivatedBy) =>
        apiClient.post('/staff/bulk-deactivate', ids, { params: { deactivatedBy } }),

    // Statistics & Utilities
    getStatistics: () => apiClient.get('/staff/statistics'),

    getAllRoles: () => apiClient.get('/staff/roles'),

    getAllStatuses: () => apiClient.get('/staff/statuses'),
};

// Authentication API
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),

    register: (data) => apiClient.post('/auth/register', data),

    logout: () => apiClient.post('/auth/logout'),

    refreshToken: (token) => apiClient.post('/auth/refresh', { token }),

    validateToken: (token) => apiClient.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

// Export API client for direct use if needed
export default apiClient;