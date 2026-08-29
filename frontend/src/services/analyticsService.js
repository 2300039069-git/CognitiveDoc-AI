import api from './api';

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
