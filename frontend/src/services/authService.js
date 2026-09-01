import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  firebaseSync: async (userData) => {
    const response = await api.post('/auth/firebase-sync', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetCode: async (email, code) => {
    const response = await api.post('/auth/verify-code', { email, code });
    return response.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      email,
      code,
      new_password: newPassword
    });
    return response.data;
  },

  directResetPassword: async (email, newPassword) => {
    const response = await api.post('/auth/direct-reset-password', {
      email,
      new_password: newPassword
    });
    return response.data;
  },

  // Link-Based Verification & Password Reset
  registerSendLink: async (userData) => {
    const frontendUrl = window.location.origin;
    const response = await api.post('/auth/register-send-link', {
      ...userData,
      frontend_url: frontendUrl
    });
    return response.data;
  },

  verifyEmailToken: async (token) => {
    const response = await api.post('/auth/verify-email-token', { token });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  forgotPasswordLink: async (email) => {
    const frontendUrl = window.location.origin;
    const response = await api.post('/auth/forgot-password-link', {
      email,
      frontend_url: frontendUrl
    });
    return response.data;
  },

  verifyResetToken: async (token) => {
    const response = await api.post('/auth/verify-reset-token', { token });
    return response.data;
  },

  confirmResetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/confirm-reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};
