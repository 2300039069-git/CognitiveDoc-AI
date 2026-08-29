import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get('/admin/documents');
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await api.delete(`/admin/documents/${docId}`);
    return response.data;
  },

  getAIMonitoring: async () => {
    const response = await api.get('/admin/ai-monitoring');
    return response.data;
  },

  getFeedback: async () => {
    const response = await api.get('/admin/feedback');
    return response.data;
  },

  updateFeedbackStatus: async (feedbackId, status) => {
    const response = await api.put(`/admin/feedback/${feedbackId}/status`, { status });
    return response.data;
  },

  submitFeedback: async (feedbackData) => {
    const response = await api.post('/admin/feedback', feedbackData);
    return response.data;
  },

  getActiveOtps: async () => {
    const response = await api.get('/admin/active-otps');
    return response.data;
  },

  purgeAllData: async () => {
    const response = await api.delete('/admin/purge-all-data');
    return response.data;
  }
};

export const analyticsService = {
  getUserAnalytics: async () => {
    const response = await api.get('/analytics/user');
    return response.data;
  },

  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  }
};
