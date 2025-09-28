import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`API Error: ${error.response?.status} ${error.response?.config?.url}`, error.response?.data);
        return Promise.reject(error);
    }
);

// Staff API service
class StaffApiService {

    // Health check
    async healthCheck() {
        const response = await api.get('/staff/health');
        return response.data;
    }

    // Get all staff
    async getAllStaff() {
        const response = await api.get('/staff');
        return response.data;
    }

    // Get staff by ID
    async getStaffById(id) {
        const response = await api.get(`/staff/${id}`);
        return response.data;
    }

    // Create new staff
    async createStaff(staffData) {
        const response = await api.post('/staff', {
            firstName: staffData.firstName,
            lastName: staffData.lastName,
            email: staffData.email,
            phoneNumber: staffData.phoneNumber,
            role: staffData.role,
            createdBy: staffData.createdBy || 'SYSTEM'
        });
        return response.data;
    }

    // Update staff
    async updateStaff(id, staffData) {
        const response = await api.put(`/staff/${id}`, staffData);
        return response.data;
    }

    // Delete staff
    async deleteStaff(id) {
        const response = await api.delete(`/staff/${id}`);
        return response.data;
    }

    // Search staff
    async searchStaff(params) {
        const queryString = new URLSearchParams();

        if (params.firstName) queryString.append('firstName', params.firstName);
        if (params.lastName) queryString.append('lastName', params.lastName);
        if (params.role) queryString.append('role', params.role);
        if (params.status) queryString.append('status', params.status);

        const response = await api.get(`/staff/search?${queryString.toString()}`);
        return response.data;
    }

    // Get statistics
    async getStats() {
        const response = await api.get('/staff/stats');
        return response.data;
    }

    // Change staff status
    async changeStaffStatus(id, status) {
        const response = await api.put(`/staff/${id}/status?status=${status}`);
        return response.data;
    }
}

export default new StaffApiService();