import api from './api';

export const aiService = {
  summarizeDocument: async (docId, summaryType = 'abstractive', lengthType = 'medium', focusKeywords = [], language = 'en') => {
    const response = await api.post('/ai/summarize', {
      doc_id: docId,
      summary_type: summaryType,
      length_type: lengthType,
      focus_keywords: focusKeywords,
      language: language,
    });
    return response.data;
  },

  getDocumentSummary: async (docId, language = 'en') => {
    const response = await api.get(`/ai/documents/${docId}/summary`, {
      params: { language }
    });
    return response.data;
  },

  chatWithDocument: async (docId, question, language = 'en') => {
    const response = await api.post('/ai/chat', {
      doc_id: docId,
      question: question,
      language: language,
    });
    return response.data;
  },

  getChatHistory: async (docId) => {
    const response = await api.get(`/ai/documents/${docId}/chat-history`);
    return response.data;
  },

  clearChatHistory: async (docId) => {
    const response = await api.delete(`/ai/documents/${docId}/chat-history`);
    return response.data;
  },

  getProcessStatus: async (docId) => {
    const response = await api.get(`/ai/process-status/${docId}`);
    return response.data;
  }
};
