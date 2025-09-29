import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user ID header for audit trails
    const userId = localStorage.getItem('userId') || 'anonymous';
    config.headers['X-User-Id'] = userId;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Monthly Reports API
export const monthlyReportsAPI = {
  // Get all monthly reports
  getAll: () => api.get('/api/monthly-reports'),
  
  // Get monthly report by ID
  getById: (id) => api.get(`/api/monthly-reports/${id}`),
  
  // Get reports by project
  getByProject: (projectId) => api.get(`/api/monthly-reports/project/${projectId}`),
  
  // Get reports by status
  getByStatus: (status) => api.get(`/api/monthly-reports/status/${status}`),
  
  // Get pending approval reports
  getPendingApproval: () => api.get('/api/monthly-reports/pending-approval'),
  
  // Get reports with high variance
  getHighVariance: (threshold = 1000) => api.get(`/api/monthly-reports/high-variance?threshold=${threshold}`),
  
  // Create new monthly report
  create: (data) => api.post('/api/monthly-reports', data),
  
  // Generate report from daily logs
  generate: (projectId, year, month) => 
    api.post(`/api/monthly-reports/generate?projectId=${projectId}&year=${year}&month=${month}`),
  
  // Update monthly report
  update: (id, data) => api.put(`/api/monthly-reports/${id}`, data),
  
  // Submit report for approval
  submit: (id) => api.post(`/api/monthly-reports/${id}/submit`),
  
  // Approve report
  approve: (id) => api.post(`/api/monthly-reports/${id}/approve`),
  
  // Reject report
  reject: (id) => api.post(`/api/monthly-reports/${id}/reject`),
  
  // Delete monthly report
  delete: (id) => api.delete(`/api/monthly-reports/${id}`),
  
  // Get statistics
  getStatistics: () => api.get('/api/monthly-reports/statistics'),
  
  // Get dashboard data
  getDashboard: () => api.get('/api/monthly-reports/dashboard'),
};

// Projects API (for dropdowns and project info)
export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  getById: (id) => api.get(`/api/projects/${id}`),
};

// Daily Logs API (for report generation)
export const dailyLogsAPI = {
  getByProject: (projectId) => api.get(`/api/daily-logs/project/${projectId}`),
  getByDateRange: (projectId, startDate, endDate) => 
    api.get(`/api/daily-logs/project/${projectId}?startDate=${startDate}&endDate=${endDate}`),
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatMonthYear = (year, month) => {
  const date = new Date(year, month - 1);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

export const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'status-draft',
    SUBMITTED: 'status-submitted',
    APPROVED: 'status-approved',
    REJECTED: 'status-rejected',
  };
  return colors[status] || 'status-draft';
};

export const getStatusText = (status) => {
  const texts = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return texts[status] || status;
};

export default api;
