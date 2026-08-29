import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const BACKEND_HOST = '10.142.15.17:8000';

export const getBaseApiUrl = () => {
  return `http://${BACKEND_HOST}/api`;
};

export const getAudioTtsUrl = (text, lang) => {
  return `http://${BACKEND_HOST}/api/ai/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
};

const api = axios.create({
  baseURL: getBaseApiUrl(),
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('mobile_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error fetching token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await AsyncStorage.removeItem('mobile_token');
        await AsyncStorage.removeItem('mobile_user');
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default api;
