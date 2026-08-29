import api from './api';

export const docService = {
  uploadDocument: async (file, tags = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (tags) {
      formData.append('tags', tags);
    }
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  getDocument: async (docId) => {
    const response = await api.get(`/documents/${docId}`);
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await api.delete(`/documents/${docId}`);
    return response.data;
  },

  getDownloadUrl: (docId, format = 'original') => {
    const token = localStorage.getItem('token');
    return `${api.defaults.baseURL}/documents/${docId}/download?format=${format}&token=${token}`;
  }
};
